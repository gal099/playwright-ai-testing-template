import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export type AIModel = 'haiku' | 'sonnet' | 'opus';

export interface AIClientOptions {
  model?: AIModel;
  maxTokens?: number;
}

export class AIClient {
  private client: Anthropic;
  private defaultModel: string;
  private defaultMaxTokens: number;

  // Model mappings
  // Updated to latest available models as of January 2026
  private modelMap: Record<AIModel, string> = {
    haiku: 'claude-3-haiku-20240307', // Claude 3 Haiku (latest stable)
    sonnet: 'claude-sonnet-4-5-20250929', // Claude Sonnet 4.5 (latest)
    opus: 'claude-opus-4-5-20251101', // Claude Opus 4.5 (latest)
  };

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Default to opus for now (will be overridden by feature-specific defaults)
    this.defaultModel = this.modelMap.opus;
    this.defaultMaxTokens = parseInt(process.env.AI_MAX_TOKENS || '4096', 10);
  }

  private getModelId(model?: AIModel): string {
    if (!model) return this.defaultModel;
    return this.modelMap[model] || this.defaultModel;
  }

  async ask(
    prompt: string,
    systemPrompt?: string,
    options?: AIClientOptions
  ): Promise<string> {
    const modelId = this.getModelId(options?.model);
    const maxTokens = options?.maxTokens || this.defaultMaxTokens;

    try {
      const message = await this.client.messages.create({
        model: modelId,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response type from AI');
    } catch (error) {
      console.error(`AI Client Error (model: ${modelId}):`, error);
      throw error;
    }
  }

  async askWithImage(
    prompt: string,
    imageBase64: string,
    mediaType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' = 'image/png',
    options?: AIClientOptions,
    systemPrompt?: string
  ): Promise<string> {
    const modelId = this.getModelId(options?.model);
    const maxTokens = options?.maxTokens || this.defaultMaxTokens;

    try {
      const message = await this.client.messages.create({
        model: modelId,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response type from AI');
    } catch (error) {
      console.error(`AI Client Error with Image (model: ${modelId}):`, error);
      throw error;
    }
  }
}

export const aiClient = new AIClient();
