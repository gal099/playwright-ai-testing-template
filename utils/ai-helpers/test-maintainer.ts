import * as fs from 'fs';
import * as path from 'path';
import { aiClient } from '../../config/ai-client';
import { glob } from 'glob';

interface MaintenanceReport {
  file: string;
  issues: string[];
  suggestions: string[];
  codeQuality: number;
}

export class TestMaintainer {
  private testDir: string;

  constructor(testDir: string = './tests') {
    this.testDir = testDir;
  }

  /**
   * Analyze all tests and provide maintenance recommendations
   */
  async analyzeTests(): Promise<MaintenanceReport[]> {
    console.log('🔍 Analyzing test suite...\n');

    const testFiles = await glob(`${this.testDir}/**/*.spec.ts`);

    if (testFiles.length === 0) {
      console.log('No test files found.');
      return [];
    }

    const reports: MaintenanceReport[] = [];

    for (const file of testFiles) {
      console.log(`Analyzing: ${file}`);
      const report = await this.analyzeTestFile(file);
      reports.push(report);
    }

    return reports;
  }

  /**
   * Analyze a single test file
   */
  private async analyzeTestFile(filePath: string): Promise<MaintenanceReport> {
    const content = fs.readFileSync(filePath, 'utf-8');

    const prompt = `
Analyze this Playwright test file for maintenance issues and improvements:

\`\`\`typescript
${content}
\`\`\`

Evaluate:
1. Code quality and maintainability
2. Test organization and structure
3. Selector reliability (prefer data-testid, roles)
4. DRY principle violations
5. Hard-coded values that should be constants
6. Missing error handling
7. Outdated patterns
8. Performance concerns
9. Test flakiness risks

Provide a JSON response:
{
  "codeQuality": 0-100,
  "issues": ["list of specific issues found"],
  "suggestions": ["actionable improvements"],
  "criticalProblems": ["urgent issues that need fixing"]
}
`;

    const systemPrompt = `You are a senior QA automation engineer expert in Playwright and test maintenance.
Provide specific, actionable feedback. Be thorough but practical.
IMPORTANT: All issues, suggestions, and feedback must be written in English only.`;

    try {
      // Use Sonnet for test analysis (needs good understanding of code patterns)
      const response = await aiClient.ask(prompt, systemPrompt, {
        model: 'sonnet',
        maxTokens: 3072
      });
      const result = JSON.parse(this.extractJSON(response));

      return {
        file: filePath,
        issues: [...(result.issues || []), ...(result.criticalProblems || [])],
        suggestions: result.suggestions || [],
        codeQuality: result.codeQuality || 50,
      };
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
      return {
        file: filePath,
        issues: ['Failed to analyze file'],
        suggestions: [],
        codeQuality: 0,
      };
    }
  }

  /**
   * Automatically refactor a test file based on AI suggestions
   */
  async refactorTest(filePath: string, dryRun: boolean = true): Promise<string> {
    console.log(`\n♻️  Refactoring: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');

    const prompt = `
Refactor this Playwright test file to improve maintainability:

\`\`\`typescript
${content}
\`\`\`

Apply these improvements:
1. Extract hard-coded selectors to constants
2. Replace brittle selectors with data-testid or roles
3. Remove code duplication
4. Improve test descriptions
5. Add proper types
6. Extract common logic to helper functions
7. Improve error messages
8. Add proper waits and assertions
9. Follow Playwright best practices

Return ONLY the refactored TypeScript code, no explanations.
Preserve all test logic and coverage.

IMPORTANT: All code, comments, and test descriptions must be in English only.
`;

    const systemPrompt = `You are an expert at refactoring Playwright tests.
Output clean, maintainable code following best practices.
Keep tests comprehensive while improving readability.
IMPORTANT: Write all code, comments, and test descriptions in English only.`;

    try {
      // Use Sonnet for refactoring (needs strong code understanding)
      const response = await aiClient.ask(prompt, systemPrompt, {
        model: 'sonnet',
        maxTokens: 4096
      });
      const refactoredCode = this.extractCodeFromMarkdown(response);

      if (dryRun) {
        console.log('✅ Refactoring complete (dry run)');
        console.log('Preview of changes:\n');
        console.log(refactoredCode);
        return refactoredCode;
      } else {
        // Create backup
        const backupPath = `${filePath}.backup`;
        fs.copyFileSync(filePath, backupPath);
        console.log(`📦 Backup created: ${backupPath}`);

        // Write refactored code
        fs.writeFileSync(filePath, refactoredCode);
        console.log(`✅ File updated: ${filePath}`);

        return refactoredCode;
      }
    } catch (error) {
      console.error('Error refactoring file:', error);
      throw error;
    }
  }

  /**
   * Update selectors across all tests based on UI changes
   */
  async updateSelectors(oldSelector: string, newSelector: string): Promise<number> {
    console.log(`\n🔄 Updating selectors:`);
    console.log(`  From: ${oldSelector}`);
    console.log(`  To: ${newSelector}`);

    const testFiles = await glob(`${this.testDir}/**/*.spec.ts`);
    let updatedCount = 0;

    for (const file of testFiles) {
      let content = fs.readFileSync(file, 'utf-8');

      if (content.includes(oldSelector)) {
        // Create backup
        const backupPath = `${file}.backup`;
        fs.copyFileSync(file, backupPath);

        // Replace selector
        content = content.replace(new RegExp(oldSelector, 'g'), newSelector);
        fs.writeFileSync(file, content);

        console.log(`  ✅ Updated: ${file}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Updated ${updatedCount} file(s)`);
    return updatedCount;
  }

  /**
   * Generate maintenance report
   */
  async generateReport(): Promise<void> {
    const reports = await this.analyzeTests();

    if (reports.length === 0) {
      console.log('\nNo tests to analyze.');
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('TEST SUITE MAINTENANCE REPORT');
    console.log('='.repeat(80) + '\n');

    const avgQuality = reports.reduce((sum, r) => sum + r.codeQuality, 0) / reports.length;

    console.log(`📊 Overall Code Quality: ${avgQuality.toFixed(1)}/100\n`);

    // Sort by quality (worst first)
    reports.sort((a, b) => a.codeQuality - b.codeQuality);

    for (const report of reports) {
      console.log(`\n📄 ${report.file}`);
      console.log(`   Quality Score: ${report.codeQuality}/100`);

      if (report.issues.length > 0) {
        console.log(`   ⚠️  Issues (${report.issues.length}):`);
        report.issues.slice(0, 5).forEach((issue) => {
          console.log(`      - ${issue}`);
        });
        if (report.issues.length > 5) {
          console.log(`      ... and ${report.issues.length - 5} more`);
        }
      }

      if (report.suggestions.length > 0) {
        console.log(`   💡 Top Suggestions:`);
        report.suggestions.slice(0, 3).forEach((suggestion) => {
          console.log(`      - ${suggestion}`);
        });
      }
    }

    console.log('\n' + '='.repeat(80));

    // Save report to file
    const reportPath = path.join(this.testDir, '../test-maintenance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
    console.log(`\n📋 Full report saved to: ${reportPath}`);
  }

  private extractJSON(text: string): string {
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    return text.trim();
  }

  private extractCodeFromMarkdown(text: string): string {
    const codeBlockMatch = text.match(/```(?:typescript|ts)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    return text.trim();
  }
}

// CLI interface
if (require.main === module) {
  const maintainer = new TestMaintainer();

  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'analyze':
      maintainer.generateReport().catch(console.error);
      break;

    case 'refactor':
      if (args.length === 0) {
        console.log('Usage: npm run ai:maintain refactor <file-path> [--apply]');
        process.exit(1);
      }
      const filePath = args[0];
      const apply = args.includes('--apply');
      maintainer
        .refactorTest(filePath, !apply)
        .catch(console.error);
      break;

    case 'update-selector':
      if (args.length < 2) {
        console.log('Usage: npm run ai:maintain update-selector <old> <new>');
        process.exit(1);
      }
      maintainer
        .updateSelectors(args[0], args[1])
        .catch(console.error);
      break;

    default:
      console.log(`
Test Maintenance Tool

Usage:
  npm run ai:maintain analyze              - Generate maintenance report
  npm run ai:maintain refactor <file>      - Preview refactoring (dry run)
  npm run ai:maintain refactor <file> --apply - Apply refactoring
  npm run ai:maintain update-selector <old> <new> - Update selectors across tests

Examples:
  npm run ai:maintain analyze
  npm run ai:maintain refactor tests/example.spec.ts
  npm run ai:maintain refactor tests/example.spec.ts --apply
  npm run ai:maintain update-selector "#old-id" "[data-testid='new-id']"
      `);
  }
}

export default TestMaintainer;
