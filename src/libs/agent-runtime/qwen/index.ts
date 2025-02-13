import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { QwenAIStream } from '../utils/streams';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/aiModels';

export interface QwenModelCard {
  id: string;
}

/*
  QwenEnableSearchModelSeries: An array of Qwen model series that support the enable_search parameter.
  Currently, enable_search is only supported on Qwen commercial series, excluding Qwen-VL and Qwen-Long series.
*/
export const QwenEnableSearchModelSeries = [
  'qwen-max',
  'qwen-plus',
  'qwen-turbo',
];

/*
  QwenLegacyModels: A set of legacy Qwen models that do not support presence_penalty.
  Currently, presence_penalty is only supported on Qwen commercial models and open-source models starting from Qwen 1.5 and later.
*/
export const QwenLegacyModels = new Set([
  'qwen-72b-chat',
  'qwen-14b-chat',
  'qwen-7b-chat',
  'qwen-1.8b-chat',
  'qwen-1.8b-longcontext-chat',
]);

export const LobeQwenAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      const { model, presence_penalty, temperature, top_p, ...rest } = payload;

      return {
        ...rest,
        frequency_penalty: undefined,
        model,
        presence_penalty:
          QwenLegacyModels.has(model)
            ? undefined
            : (presence_penalty !== undefined && presence_penalty >= -2 && presence_penalty <= 2)
              ? presence_penalty
              : undefined,
        stream: !payload.tools,
        temperature: (temperature !== undefined && temperature >= 0 && temperature < 2) ? temperature : undefined,
        ...(model.startsWith('qvq') || model.startsWith('qwen-vl') ? {
          top_p: (top_p !== undefined && top_p > 0 && top_p <= 1) ? top_p : undefined,
        } : {
          top_p: (top_p !== undefined && top_p > 0 && top_p < 1) ? top_p : undefined,
        }),
        ...(process.env.QWEN_ENABLE_SEARCH === '1' && QwenEnableSearchModelSeries.some(prefix => model.startsWith(prefix)) && {
          enable_search: true,
          search_options: {
            search_strategy: process.env.QWEN_SEARCH_STRATEGY || 'standard', // standard or pro
          }
        }),
        ...(payload.tools && {
          parallel_tool_calls: true,
        }),
      } as any;
    },
    handleStream: QwenAIStream,
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_QWEN_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const functionCallKeywords = [
        'qwen-max',
        'qwen-plus',
        'qwen-turbo',
        'qwen2.5',
      ];

      const visionKeywords = [
        'qvq',
        'vl',
      ];

      const reasoningKeywords = [
        'qvq',
        'qwq',
        'deepseek-r1'
      ];

      const model = m as unknown as QwenModelCard;

      return {
        contextWindowTokens: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id === m.id)?.contextWindowTokens ?? undefined,
        displayName: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id === m.id)?.displayName ?? undefined,
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id === m.id)?.enabled || false,
        functionCall: functionCallKeywords.some(keyword => model.id.toLowerCase().includes(keyword)),
        id: model.id,
        reasoning: reasoningKeywords.some(keyword => model.id.toLowerCase().includes(keyword)),
        vision: visionKeywords.some(keyword => model.id.toLowerCase().includes(keyword)),
      };
    },
  },
  provider: ModelProvider.Qwen,
});
