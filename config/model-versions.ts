/**
 * Claude Model Version Configuration
 *
 * Centralized model version management. Update versions here when
 * Anthropic releases new models or deprecates old ones.
 *
 * This file is the single source of truth for model IDs used throughout
 * the framework. When models are deprecated or new versions are released,
 * only this file needs to be updated.
 *
 * Last updated: 2026-01-14
 *
 * @see https://docs.anthropic.com/en/docs/about-claude/models
 */

/**
 * Available Claude model versions
 *
 * These IDs map to specific model releases from Anthropic.
 * The framework uses abstract names (haiku/sonnet/opus) that map to these IDs.
 */
export const MODEL_VERSIONS = {
  /**
   * Claude 3 Haiku - Fast and cost-effective
   * - Best for: Simple text tasks, basic analysis, high-volume operations
   * - Cost: ~$0.00025/1K input tokens, ~$0.00125/1K output tokens
   */
  haiku: 'claude-3-haiku-20240307',

  /**
   * Claude Sonnet 4.5 - Balanced performance and cost
   * - Best for: AI vision, test generation, balanced tasks
   * - Cost: ~$0.003/1K input tokens, ~$0.015/1K output tokens
   */
  sonnet: 'claude-sonnet-4-5-20250929',

  /**
   * Claude Opus 4.5 - Most capable model
   * - Best for: Complex reasoning, fallback for difficult cases
   * - Cost: ~$0.015/1K input tokens, ~$0.075/1K output tokens
   */
  opus: 'claude-opus-4-5-20251101',
} as const;

/**
 * Type-safe model names
 *
 * Use this type to ensure you're referencing valid model names.
 */
export type ModelName = keyof typeof MODEL_VERSIONS;

/**
 * Model families for display purposes
 *
 * Human-readable names for each model family (without specific dates).
 */
export const MODEL_FAMILIES = {
  haiku: 'Claude 3 Haiku',
  sonnet: 'Claude Sonnet 4.5',
  opus: 'Claude Opus 4.5',
} as const;

/**
 * Get model version by name
 *
 * @param modelName - The abstract model name (haiku/sonnet/opus)
 * @returns The specific model ID to use with the Anthropic API
 *
 * @example
 * ```typescript
 * const modelId = getModelVersion('sonnet');
 * // Returns: 'claude-sonnet-4-5-20250929'
 * ```
 */
export function getModelVersion(modelName: ModelName): string {
  return MODEL_VERSIONS[modelName];
}

/**
 * Get model family name by model name
 *
 * @param modelName - The abstract model name (haiku/sonnet/opus)
 * @returns The human-readable family name
 *
 * @example
 * ```typescript
 * const family = getModelFamily('sonnet');
 * // Returns: 'Claude Sonnet 4.5'
 * ```
 */
export function getModelFamily(modelName: ModelName): string {
  return MODEL_FAMILIES[modelName];
}
