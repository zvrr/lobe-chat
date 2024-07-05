import { ModelProviderCard } from '@/types/llm';

// ref https://ai.google.dev/models/gemini
// api https://ai.google.dev/api/rest/v1beta/models/list
const Google: ModelProviderCard = {
  chatModels: [
    {
      description: 'Fast and versatile multimodal model for scaling across diverse tasks',
      displayName: 'Gemini 1.5 Flash',
      enabled: true,
      functionCall: true,
      id: 'gemini-1.5-flash-latest',
      maxOutput: 8192,
      tokens: 1_048_576 + 8192,
      vision: true,
    },
    {
      description: 'Fast and versatile multimodal model for scaling across diverse tasks',
      displayName: 'Gemini 1.5 Flash 001',
      functionCall: true,
      id: 'gemini-1.5-flash-001',
      maxOutput: 8192,
      tokens: 1_048_576 + 8192,
      vision: true,
    },
    {
      description: 'Mid-size multimodal model that supports up to 1 million tokens',
      displayName: 'Gemini 1.5 Pro',
      enabled: true,
      functionCall: true,
      id: 'gemini-1.5-pro-latest',
      maxOutput: 8192,
      tokens: 2_097_152 + 8192,
      vision: true,
    },
    {
      description: 'Mid-size multimodal model that supports up to 1 million tokens',
      displayName: 'Gemini 1.5 Pro 001',
      functionCall: true,
      id: 'gemini-1.5-pro-001',
      maxOutput: 8192,
      tokens: 2_097_152 + 8192,
      vision: true,
    },
    {
      description: 'The best model for scaling across a wide range of tasks. This is the latest model.',
      displayName: 'Gemini 1.0 Pro',
      id: 'gemini-1.0-pro-latest',
      maxOutput: 2048,
      tokens: 30_720 + 2048,
    },
    {
      description: 'The best model for scaling across a wide range of tasks. This is a stable model that supports tuning.',
      displayName: 'Gemini 1.0 Pro 001 (Tuning)',
      functionCall: true,
      id: 'gemini-1.0-pro-001',
      maxOutput: 2048,
      tokens: 30_720 + 2048,
    },
    {
      description: 'The best model for scaling across a wide range of tasks. Released April 9, 2024.',
      displayName: 'Gemini 1.0 Pro 002 (Tuning)',
      id: 'gemini-1.0-pro-002',
      maxOutput: 2048,
      tokens: 30_720 + 2048,
    },
    {
      description: 'The most capable model for highly complex tasks',
      displayName: 'Gemini 1.0 Ultra',
      id: 'gemini-ultra',
      maxOutput: 2048,
      tokens: 32_768,
    },
    {
      description: 'A legacy text-only model optimized for chat conversations',
      displayName: 'PaLM 2 Chat (Legacy)',
      id: 'chat-bison-001',
      legacy: true,
      maxOutput: 1024,
      // tokens: 4096 + 1024, // none tokens test
    }
  ],
  checkModel: 'gemini-1.5-flash',
  id: 'google',
  name: 'Google',
  proxyUrl: {
    placeholder: 'https://generativelanguage.googleapis.com',
  },
};

export default Google;
