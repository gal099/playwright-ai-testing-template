import { chromium, Page } from '@playwright/test';
import { TestCasePlanner } from './test-case-planner';
import { aiClient } from '../../config/ai-client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

/**
 * Represents a raw link extracted from page
 */
interface RawLink {
  type: string;
  text: string;
  href: string;
  selector: string;
}

/**
 * Represents a discovered navigation link on a page
 */
interface DiscoveredLink {
  url: string;
  type: 'button' | 'link' | 'nav' | 'form-action';
  text: string;
  selector: string;
  explored: boolean;
  ignored: boolean;
}

/**
 * Represents a page that has been explored
 */
interface ExploredPage {
  url: string;
  exploredAt: string;
  testCasesDoc: string;
  pageTitle: string;
  discoveredLinks: DiscoveredLink[];
}

/**
 * The main exploration map structure
 */
interface ExplorationMap {
  baseUrl: string;
  startedAt: string;
  lastUpdatedAt: string;
  explored: ExploredPage[];
  queue: string[];
  ignored: string[];
}

/**
 * Options for site exploration
 */
interface SiteExplorerOptions {
  loginFirst?: boolean;
  mapFilePath?: string;
}

/**
 * Result of analyzing a single page
 */
interface PageAnalysisResult {
  url: string;
  testCasesDoc: string;
  discoveredLinks: DiscoveredLink[];
  pageTitle: string;
}

/**
 * Interactive Site Explorer
 *
 * Allows users to incrementally crawl and analyze a website,
 * generating test case documentation for each discovered page.
 *
 * Cost: ~$0.05-0.16 per page analyzed
 * - Test case generation: ~$0.05-0.15 (Sonnet, via TestCasePlanner)
 * - Link filtering: ~$0.001 (Haiku)
 */
export class SiteExplorer {
  private testCasePlanner: TestCasePlanner;
  private explorationMap: ExplorationMap;
  private mapFilePath: string;

  constructor(options?: SiteExplorerOptions) {
    this.testCasePlanner = new TestCasePlanner();
    this.mapFilePath = options?.mapFilePath || '.exploration-map.json';
    this.explorationMap = this.loadOrCreateMap();
  }

  /**
   * Main entry point for interactive exploration
   *
   * @param startUrl URL to start exploration from
   * @param options Exploration options
   */
  async exploreInteractive(startUrl: string, options?: SiteExplorerOptions): Promise<void> {
    console.log(`\n🚀 Starting interactive site exploration from: ${startUrl}`);
    console.log('💡 Type "quit" at any prompt to end exploration\n');

    // Initialize base URL if not set
    if (!this.explorationMap.baseUrl) {
      const urlObj = new URL(startUrl);
      this.explorationMap.baseUrl = urlObj.origin;
    }

    let currentUrl = startUrl;
    const visited = new Set<string>(this.explorationMap.explored.map(p => this.normalizeUrl(p.url)));

    while (true) {
      const normalizedUrl = this.normalizeUrl(currentUrl);

      // Skip if already explored
      if (visited.has(normalizedUrl)) {
        console.log(`⏭️  Page already explored: ${currentUrl}`);

        // Get unexplored links from this page
        const exploredPage = this.explorationMap.explored.find(p => this.normalizeUrl(p.url) === normalizedUrl);
        if (exploredPage) {
          const unexploredLinks = exploredPage.discoveredLinks.filter(l =>
            !l.explored && !l.ignored && !visited.has(this.normalizeUrl(l.url))
          );

          if (unexploredLinks.length === 0) {
            console.log('✅ No more unexplored links from this page.');
            break;
          }

          this.displayLinks(unexploredLinks);
          const choice = await this.promptUserChoice(unexploredLinks);

          if (choice === 'quit') {
            console.log('\n👋 Exploration ended by user.');
            break;
          }

          currentUrl = unexploredLinks[choice as number].url;
          continue;
        }
      }

      try {
        // Analyze current page
        const pageData = await this.analyzePage(currentUrl);
        visited.add(normalizedUrl);

        // Save to exploration map
        this.addExploredPage(pageData);
        this.saveMap();

        // Display discovered links
        const links = pageData.discoveredLinks.filter(l =>
          !l.explored && !l.ignored && !visited.has(this.normalizeUrl(l.url))
        );

        if (links.length === 0) {
          console.log('\n✅ No more unexplored links from this page.');

          // Check if there are any unexplored links in the queue
          const globalUnexplored = this.getUnexploredLinks().filter(l =>
            !visited.has(this.normalizeUrl(l.url))
          );

          if (globalUnexplored.length > 0) {
            console.log(`\n📋 Found ${globalUnexplored.length} unexplored link(s) from previous pages.`);
            this.displayLinks(globalUnexplored);

            const choice = await this.promptUserChoice(globalUnexplored);
            if (choice === 'quit') {
              console.log('\n👋 Exploration ended by user.');
              break;
            }
            currentUrl = globalUnexplored[choice as number].url;
            continue;
          }

          break;
        }

        this.displayLinks(links);

        // Prompt user for next action
        const choice = await this.promptUserChoice(links);

        if (choice === 'quit') {
          console.log('\n👋 Exploration ended by user.');
          break;
        }

        // Navigate to chosen link
        currentUrl = links[choice as number].url;

      } catch (error) {
        console.error(`\n❌ Error analyzing page ${currentUrl}:`, error);
        console.log('⏭️  Skipping to next page...\n');

        // Try to recover by showing available unexplored links
        const unexploredLinks = this.getUnexploredLinks().filter(l =>
          !visited.has(this.normalizeUrl(l.url))
        );

        if (unexploredLinks.length === 0) {
          console.log('No more pages to explore.');
          break;
        }

        this.displayLinks(unexploredLinks);
        const choice = await this.promptUserChoice(unexploredLinks);

        if (choice === 'quit') {
          console.log('\n👋 Exploration ended by user.');
          break;
        }

        currentUrl = unexploredLinks[choice as number].url;
      }
    }

    // Display summary report
    this.displaySummary();
  }

  /**
   * Analyze a single page and generate test cases
   *
   * @param url URL to analyze
   * @returns Page analysis result
   */
  private async analyzePage(url: string): Promise<PageAnalysisResult> {
    console.log(`\n📋 Analyzing: ${url}`);

    // Use existing TestCasePlanner to generate test cases
    const screenName = this.urlToScreenName(url);
    const testCasesDoc = await this.testCasePlanner.generateTestCases({
      urlOrScreenshot: url,
      screenName: screenName,
    });

    console.log(`✅ Test cases generated: ${testCasesDoc}`);

    // Discover navigation links
    const { links, pageTitle } = await this.discoverNavigationLinks(url);

    console.log(`🔗 Found ${links.length} navigation link(s)`);

    return {
      url,
      testCasesDoc,
      discoveredLinks: links,
      pageTitle,
    };
  }

  /**
   * Discover navigation links from a page
   *
   * @param url URL to extract links from
   * @returns Discovered links and page title
   */
  private async discoverNavigationLinks(url: string): Promise<{ links: DiscoveredLink[]; pageTitle: string }> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 });

      const pageTitle = await page.title();

      // Extract all potential navigation elements
      const rawLinks = await page.evaluate(() => {
        const links: Array<{ type: string; text: string; href: string; selector: string }> = [];
        const seenUrls = new Set<string>();

        // Helper to add unique links
        const addLink = (type: string, text: string, href: string, selector: string) => {
          if (href && !seenUrls.has(href)) {
            seenUrls.add(href);
            links.push({ type, text, href, selector });
          }
        };

        // Buttons with navigation intent (only capture forms or clear navigation)
        document.querySelectorAll('button').forEach((el, index) => {
          const text = el.textContent?.trim() || '';
          const onClick = el.getAttribute('onclick');
          const formAction = el.closest('form')?.action;

          // Only capture buttons with clear navigation intent
          if (formAction || (onClick && onClick.includes('location'))) {
            const href = formAction || window.location.href;
            addLink('button', text, href, `button:nth-of-type(${index + 1})`);
          }
        });

        // Links
        document.querySelectorAll('a[href]').forEach((el) => {
          const text = el.textContent?.trim() || '';
          const href = (el as HTMLAnchorElement).href;
          const hrefAttr = el.getAttribute('href') || '';

          // Filter out non-navigation links
          if (!hrefAttr.startsWith('#') &&
              !hrefAttr.startsWith('javascript:') &&
              !hrefAttr.startsWith('mailto:') &&
              !hrefAttr.startsWith('tel:')) {
            addLink('link', text, href, `a[href="${hrefAttr}"]`);
          }
        });

        // Form actions
        document.querySelectorAll('form[action]').forEach((el) => {
          const action = (el as HTMLFormElement).action;
          const actionAttr = el.getAttribute('action') || '';
          if (actionAttr && !actionAttr.startsWith('#')) {
            addLink('form-action', 'Form submission', action, `form[action="${actionAttr}"]`);
          }
        });

        // Navigation elements
        document.querySelectorAll('nav a[href]').forEach((el) => {
          const text = el.textContent?.trim() || '';
          const href = (el as HTMLAnchorElement).href;
          const hrefAttr = el.getAttribute('href') || '';

          if (!hrefAttr.startsWith('#') && !hrefAttr.startsWith('javascript:')) {
            addLink('nav', text, href, `nav a[href="${hrefAttr}"]`);
          }
        });

        return links;
      });

      // Filter using AI to identify only significant navigation
      const filteredLinks = await this.filterNavigationLinks(rawLinks, url);

      return { links: filteredLinks, pageTitle };

    } finally {
      await browser.close();
    }
  }

  /**
   * Use AI to filter only navigation-relevant links
   *
   * Cost: ~$0.001 per page (using Haiku)
   *
   * @param rawLinks Raw links extracted from page
   * @param pageUrl URL of the page (for context)
   * @returns Filtered links
   */
  private async filterNavigationLinks(rawLinks: RawLink[], pageUrl: string): Promise<DiscoveredLink[]> {
    if (rawLinks.length === 0) {
      return [];
    }

    // If only a few links, no need for AI filtering
    if (rawLinks.length <= 5) {
      return rawLinks.map((link) => ({
        url: link.href,
        type: link.type as 'button' | 'link' | 'nav' | 'form-action',
        text: link.text || 'No text',
        selector: link.selector,
        explored: false,
        ignored: false,
      }));
    }

    const prompt = `Given this list of interactive elements from a web page at ${pageUrl}, identify which ones represent SIGNIFICANT NAVIGATION (pages/screens user can navigate to).

Elements found:
${JSON.stringify(rawLinks.slice(0, 30), null, 2)}

Filter OUT:
- Tooltips, popovers, modals
- Anchor links (same page, #sections)
- External links to other domains (keep same-origin only)
- Duplicate links to same destination
- Non-navigation actions (delete, save, download, etc.)
- Footer links (terms, privacy, contact)
- Social media links

Filter IN:
- Main navigation menu items
- Primary action buttons that navigate to new pages
- Form submissions that go to different pages
- Section/module navigation within the application
- Authentication links (login, register, logout)

Return ONLY a JSON array of filtered links with this structure:
[
  {
    "url": "full URL",
    "type": "button|link|nav|form-action",
    "text": "display text",
    "selector": "playwright selector"
  }
]

Return ONLY the JSON array, no explanation. If no significant navigation links found, return empty array [].`;

    try {
      const response = await aiClient.ask(prompt, undefined, {
        model: 'haiku', // Cheap model for filtering task
        maxTokens: 2048,
      });

      // Try to parse JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const filtered: Array<{ url?: string; href?: string; type: string; text: string; selector: string }> = JSON.parse(jsonMatch[0]);
        return filtered.map((link) => ({
          url: link.url || link.href || '',
          type: link.type as 'button' | 'link' | 'nav' | 'form-action',
          text: link.text || 'No text',
          selector: link.selector,
          explored: false,
          ignored: false,
        }));
      }

      // If no JSON found, fall back to all links
      console.warn('⚠️  AI filtering returned unexpected format, showing all links');
      return rawLinks.map((link) => ({
        url: link.href,
        type: link.type as 'button' | 'link' | 'nav' | 'form-action',
        text: link.text || 'No text',
        selector: link.selector,
        explored: false,
        ignored: false,
      }));

    } catch (error) {
      console.warn('⚠️  AI filtering failed, showing all links:', error);
      return rawLinks.map((link) => ({
        url: link.href,
        type: link.type as 'button' | 'link' | 'nav' | 'form-action',
        text: link.text || 'No text',
        selector: link.selector,
        explored: false,
        ignored: false,
      }));
    }
  }

  /**
   * Display discovered links to user
   *
   * @param links Links to display
   */
  private displayLinks(links: DiscoveredLink[]): void {
    console.log('\n🔗 Available navigation links:');
    links.forEach((link, index) => {
      const linkText = link.text.substring(0, 50);
      console.log(`  [${index + 1}] ${link.url}`);
      console.log(`      ${link.type}: "${linkText}"`);
    });
  }

  /**
   * Prompt user to choose next action
   *
   * @param links Available links
   * @returns User choice (number index or 'quit')
   */
  private async promptUserChoice(links: DiscoveredLink[]): Promise<number | 'quit'> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('\n? Which page to explore next? (Enter number or "quit"): ', (answer: string) => {
        rl.close();

        const trimmed = answer.trim().toLowerCase();

        if (trimmed === 'quit' || trimmed === 'q' || trimmed === 'exit') {
          resolve('quit');
          return;
        }

        const index = parseInt(answer) - 1;
        if (index >= 0 && index < links.length) {
          resolve(index);
        } else {
          console.log('❌ Invalid choice. Please enter a valid number or "quit".');
          resolve('quit');
        }
      });
    });
  }

  /**
   * Convert URL to screen name
   *
   * @param url URL to convert
   * @returns Screen name suitable for file naming
   */
  private urlToScreenName(url: string): string {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      if (path === '/' || path === '') {
        return 'home';
      }

      // Remove leading/trailing slashes and replace remaining slashes with hyphens
      const name = path
        .replace(/^\/+|\/+$/g, '')
        .replace(/\//g, '-')
        .toLowerCase();

      return name || 'index';
    } catch (error) {
      return 'page';
    }
  }

  /**
   * Normalize URL for comparison (ignore query params and hashes)
   *
   * @param url URL to normalize
   * @returns Normalized URL
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch (error) {
      return url;
    }
  }

  /**
   * Add explored page to map
   *
   * @param pageData Page data to add
   */
  private addExploredPage(pageData: PageAnalysisResult): void {
    const normalizedUrl = this.normalizeUrl(pageData.url);

    // Remove if already exists (update case)
    this.explorationMap.explored = this.explorationMap.explored.filter(
      p => this.normalizeUrl(p.url) !== normalizedUrl
    );

    // Add new entry
    this.explorationMap.explored.push({
      url: pageData.url,
      exploredAt: new Date().toISOString(),
      testCasesDoc: pageData.testCasesDoc,
      pageTitle: pageData.pageTitle,
      discoveredLinks: pageData.discoveredLinks,
    });

    // Mark links in other pages as explored
    this.explorationMap.explored.forEach(page => {
      page.discoveredLinks.forEach(link => {
        if (this.normalizeUrl(link.url) === normalizedUrl) {
          link.explored = true;
        }
      });
    });
  }

  /**
   * Get all unexplored links across all explored pages
   *
   * @returns List of unexplored links
   */
  private getUnexploredLinks(): DiscoveredLink[] {
    const links: DiscoveredLink[] = [];
    const seen = new Set<string>();

    this.explorationMap.explored.forEach(page => {
      page.discoveredLinks.forEach(link => {
        const normalizedUrl = this.normalizeUrl(link.url);
        if (!link.explored && !link.ignored && !seen.has(normalizedUrl)) {
          seen.add(normalizedUrl);
          links.push(link);
        }
      });
    });

    return links;
  }

  /**
   * Load or create exploration map
   *
   * @returns Exploration map
   */
  private loadOrCreateMap(): ExplorationMap {
    if (fs.existsSync(this.mapFilePath)) {
      try {
        const data = fs.readFileSync(this.mapFilePath, 'utf-8');
        const map = JSON.parse(data);
        console.log(`📂 Loaded existing exploration map: ${this.mapFilePath}`);
        return map;
      } catch (error) {
        console.warn(`⚠️  Failed to load exploration map, creating new one`);
      }
    }

    return {
      baseUrl: '',
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      explored: [],
      queue: [],
      ignored: [],
    };
  }

  /**
   * Save exploration map to disk
   */
  private saveMap(): void {
    this.explorationMap.lastUpdatedAt = new Date().toISOString();
    fs.writeFileSync(
      this.mapFilePath,
      JSON.stringify(this.explorationMap, null, 2),
      'utf-8'
    );
  }

  /**
   * Display exploration summary
   */
  private displaySummary(): void {
    const totalPages = this.explorationMap.explored.length;
    const totalLinks = this.explorationMap.explored.reduce(
      (sum, page) => sum + page.discoveredLinks.length,
      0
    );
    const unexploredLinks = this.getUnexploredLinks().length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Exploration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Pages explored: ${totalPages}`);
    console.log(`🔗 Total links discovered: ${totalLinks}`);
    console.log(`📄 Test case docs generated: ${totalPages}`);
    console.log(`⏭️  Unexplored links remaining: ${unexploredLinks}`);
    console.log(`\n💾 Exploration map saved: ${path.resolve(this.mapFilePath)}`);

    if (this.explorationMap.explored.length > 0) {
      console.log('\n📝 Generated test case documentation:');
      this.explorationMap.explored.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.pageTitle || this.urlToScreenName(page.url)}`);
        console.log(`     ${page.testCasesDoc}`);
      });
    }

    console.log('\n💡 Next steps:');
    console.log('  1. Review generated test case documents in docs/');
    console.log('  2. Use /new-screen command to automate P1 tests');
    console.log('  3. Run "npm run ai:explore <url>" again to explore more pages');
    console.log('='.repeat(60) + '\n');
  }
}
