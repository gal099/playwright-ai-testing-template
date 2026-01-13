import { Page, Locator } from '@playwright/test';
import { aiClient } from '../../config/ai-client';
import * as fs from 'fs';
import * as path from 'path';

interface SelectorHealingCache {
  [originalSelector: string]: {
    healedSelector: string;
    timestamp: number;
    confidence: number;
  };
}

export class SelfHealingSelector {
  private cache: SelectorHealingCache = {};
  private cacheFile = path.join(__dirname, '../../.selector-cache.json');
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.ENABLE_SELF_HEALING !== 'false';
    this.loadCache();
  }

  private loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        this.cache = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load selector cache:', error);
      this.cache = {};
    }
  }

  private saveCache() {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('Could not save selector cache:', error);
    }
  }

  async findElement(page: Page, selector: string, description?: string): Promise<Locator> {
    if (!this.enabled) {
      return page.locator(selector);
    }

    try {
      // Try original selector first
      const locator = page.locator(selector);
      await locator.first().waitFor({ timeout: 2000 });
      return locator;
    } catch (error) {
      console.log(`⚠️  Selector failed: ${selector}`);
      console.log(`🔧 Attempting self-healing...`);

      // Check cache first
      if (this.cache[selector]) {
        const cached = this.cache[selector];
        const age = Date.now() - cached.timestamp;

        // Cache valid for 1 hour
        if (age < 3600000) {
          console.log(`📦 Using cached healed selector`);
          try {
            const healedLocator = page.locator(cached.healedSelector);
            await healedLocator.first().waitFor({ timeout: 2000 });
            return healedLocator;
          } catch {
            console.log(`❌ Cached selector also failed, regenerating...`);
            delete this.cache[selector];
          }
        }
      }

      // Attempt AI healing
      const healedSelector = await this.healSelector(page, selector, description);

      if (healedSelector) {
        console.log(`✅ Healed selector: ${healedSelector}`);

        // Update cache
        this.cache[selector] = {
          healedSelector,
          timestamp: Date.now(),
          confidence: 0.8,
        };
        this.saveCache();

        return page.locator(healedSelector);
      }

      // If healing failed, throw original error
      throw new Error(`Could not find or heal selector: ${selector}`);
    }
  }

  private async healSelector(page: Page, originalSelector: string, description?: string): Promise<string | null> {
    try {
      // Get page screenshot and HTML structure
      const screenshot = await page.screenshot({ fullPage: false });
      const screenshotBase64 = screenshot.toString('base64');

      // Get page structure
      const pageStructure = await page.evaluate(() => {
        const getElementInfo = (el: Element) => ({
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          classes: Array.from(el.classList),
          text: el.textContent?.trim().substring(0, 100),
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {} as Record<string, string>),
        });

        // Get all interactive elements
        const elements = Array.from(
          document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]')
        );

        return elements.slice(0, 100).map(getElementInfo);
      });

      const prompt = `
The Playwright selector "${originalSelector}" is not working.
${description ? `This element should be: ${description}` : ''}

Available elements on the page:
${JSON.stringify(pageStructure, null, 2)}

Based on the screenshot and available elements, suggest a NEW working selector that would find the intended element.

Consider:
1. data-testid attributes (preferred)
2. Accessible roles and labels
3. Unique text content
4. ID or class combinations
5. Parent-child relationships

Return ONLY the new selector string, nothing else. Examples:
- [data-testid="submit-button"]
- button:has-text("Submit")
- #login-form >> button
- [aria-label="Close dialog"]

NEW SELECTOR:`;

      const systemPrompt = `You are a Playwright selector expert. Analyze the page and suggest the most reliable selector.
Prefer data-testid, then accessible roles, then stable attributes. Avoid brittle selectors based on DOM position.`;

      // Use Haiku for cost-efficient selector healing
      const response = await aiClient.askWithImage(
        prompt,
        screenshotBase64,
        'image/png',
        {
          model: 'haiku',
          maxTokens: 1024
        },
        systemPrompt
      );

      // Clean the response
      const selector = response.trim().replace(/^["']|["']$/g, '');

      // Validate the new selector
      try {
        await page.locator(selector).first().waitFor({ timeout: 2000 });
        return selector;
      } catch {
        console.log(`❌ AI suggested selector doesn't work: ${selector}`);
        return null;
      }
    } catch (error) {
      console.error('Error during selector healing:', error);
      return null;
    }
  }

  clearCache() {
    this.cache = {};
    if (fs.existsSync(this.cacheFile)) {
      fs.unlinkSync(this.cacheFile);
    }
  }
}

export const selfHealingSelector = new SelfHealingSelector();
