import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeDoubaoAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  debug: {
    chatCompletion: () => process.env.DEBUG_DOUBAO_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Doubao,
});