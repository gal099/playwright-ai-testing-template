import { aiClient } from '../config/ai-client';
import { MODEL_VERSIONS, MODEL_FAMILIES, ModelName } from '../config/model-versions';

/**
 * Health Check: Claude Model Versions
 *
 * This script verifies that the configured Claude models are valid and accessible.
 * Run this when you suspect model versions might be deprecated or when updating models.
 *
 * Usage:
 *   npm run check-models
 *
 * Requirements:
 *   - ANTHROPIC_API_KEY must be set in .env
 *   - Small amount of API credits (~$0.01 total for all checks)
 */

interface ModelCheckResult {
  model: ModelName;
  family: string;
  version: string;
  status: 'success' | 'error';
  error?: string;
  latency?: number;
}

async function checkModel(modelName: ModelName): Promise<ModelCheckResult> {
  const startTime = Date.now();
  const family = MODEL_FAMILIES[modelName];
  const version = MODEL_VERSIONS[modelName];

  console.log(`\n🔍 Testing ${family} (${version})...`);

  try {
    // Send minimal request to test model availability
    const response = await aiClient.ask(
      'Respond with only the word "OK"',
      undefined,
      {
        model: modelName,
        maxTokens: 10,
      }
    );

    const latency = Date.now() - startTime;

    // Check if response is valid
    if (response && response.trim().length > 0) {
      console.log(`✅ Success (${latency}ms) - Response: "${response.trim()}"`);
      return {
        model: modelName,
        family,
        version,
        status: 'success',
        latency,
      };
    } else {
      console.log(`⚠️  Warning - Empty response`);
      return {
        model: modelName,
        family,
        version,
        status: 'error',
        error: 'Empty response from API',
      };
    }
  } catch (error: any) {
    const latency = Date.now() - startTime;

    // Parse error type
    let errorMessage = error.message || 'Unknown error';
    let errorType = 'Unknown';

    if (error.status === 404) {
      errorType = 'Model Not Found (404)';
      errorMessage = 'Model version is deprecated or invalid';
    } else if (error.status === 401) {
      errorType = 'Authentication Error (401)';
      errorMessage = 'Invalid or missing ANTHROPIC_API_KEY';
    } else if (error.status === 529) {
      errorType = 'Server Overloaded (529)';
      errorMessage = 'Anthropic servers temporarily overloaded - model is valid';
    } else if (error.status >= 500) {
      errorType = 'Server Error';
      errorMessage = 'Anthropic API error - try again later';
    }

    console.log(`❌ ${errorType} (${latency}ms)`);
    console.log(`   Error: ${errorMessage}`);

    return {
      model: modelName,
      family,
      version,
      status: error.status === 529 ? 'success' : 'error', // 529 means model exists but server busy
      error: errorMessage,
      latency,
    };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Claude Model Version Health Check                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\nChecking configured models in config/model-versions.ts...\n');

  // Check ANTHROPIC_API_KEY
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found in environment variables');
    console.error('\nPlease set your API key in .env:');
    console.error('  ANTHROPIC_API_KEY=sk-ant-...\n');
    process.exit(1);
  }

  // Test all models
  const models: ModelName[] = ['haiku', 'sonnet', 'opus'];
  const results: ModelCheckResult[] = [];

  for (const modelName of models) {
    const result = await checkModel(modelName);
    results.push(result);

    // Small delay between requests to be nice to API
    if (modelName !== models[models.length - 1]) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    SUMMARY                                ');
  console.log('═══════════════════════════════════════════════════════════\n');

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  results.forEach((result) => {
    const icon = result.status === 'success' ? '✅' : '❌';
    const latencyStr = result.latency ? ` (${result.latency}ms)` : '';
    console.log(`${icon} ${result.family}${latencyStr}`);
    console.log(`   Version: ${result.version}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  // Final verdict
  console.log('───────────────────────────────────────────────────────────');

  if (errorCount === 0) {
    console.log('✅ All models are valid and accessible!\n');
    process.exit(0);
  } else if (errorCount < results.length) {
    console.log(`⚠️  ${errorCount} model(s) failed, ${successCount} succeeded\n`);
    console.log('Action required:');
    console.log('  1. Check error messages above');
    console.log('  2. Update model versions in config/model-versions.ts');
    console.log('  3. Run this check again to verify fixes\n');
    process.exit(1);
  } else {
    console.log('❌ All models failed - check API key and network connection\n');
    process.exit(1);
  }
}

// Run check
main().catch((error) => {
  console.error('\n❌ Unexpected error during health check:');
  console.error(error);
  process.exit(1);
});
