/* eslint-disable sort-keys-fix/sort-keys-fix */
// ******* Runtime Biz Error ******* //
export const AgentRuntimeErrorType = {
  AgentRuntimeError: 'AgentRuntimeError', // Agent Runtime 模块运行时错误
  LocationNotSupportError: 'LocationNotSupportError',
  QuotaLimitReached: 'QuotaLimitReached',
  PermissionDenied: 'PermissionDenied',

  InvalidProviderAPIKey: 'InvalidProviderAPIKey',
  ProviderBizError: 'ProviderBizError',

  InvalidOllamaArgs: 'InvalidOllamaArgs',
  OllamaBizError: 'OllamaBizError',

  InvalidBedrockCredentials: 'InvalidBedrockCredentials',
  StreamChunkError: 'StreamChunkError',

  InvalidGithubToken: 'InvalidGithubToken',

  ConnectionCheckFailed: 'ConnectionCheckFailed',

  /**
   * @deprecated
   */
  NoOpenAIAPIKey: 'NoOpenAIAPIKey',
  /**
   * @deprecated
   */
  OpenAIBizError: 'OpenAIBizError',
} as const;

export const AGENT_RUNTIME_ERROR_SET = new Set<string>(Object.values(AgentRuntimeErrorType));

export type ILobeAgentRuntimeErrorType =
  (typeof AgentRuntimeErrorType)[keyof typeof AgentRuntimeErrorType];
