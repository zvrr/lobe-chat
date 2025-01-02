import { MessageItem } from '@/database/schemas';
import {
  ChatMessage,
  ChatMessageError,
  ChatTTS,
  ChatTranslate,
  CreateMessageParams,
} from '@/types/message';

/* eslint-disable typescript-sort-keys/interface */

export interface IMessageService {
  createMessage(data: CreateMessageParams): Promise<string>;
  batchCreateMessages(messages: MessageItem[]): Promise<any>;

  getMessages(sessionId: string, topicId?: string): Promise<ChatMessage[]>;
  getAllMessages(): Promise<ChatMessage[]>;
  getAllMessagesInSession(sessionId: string): Promise<ChatMessage[]>;
  countMessages(): Promise<number>;
  countTodayMessages(): Promise<number>;

  updateMessageError(id: string, error: ChatMessageError): Promise<any>;
  updateMessage(id: string, message: Partial<MessageItem>): Promise<any>;
  updateMessageTTS(id: string, tts: Partial<ChatTTS> | false): Promise<any>;
  updateMessageTranslate(id: string, translate: Partial<ChatTranslate> | false): Promise<any>;
  updateMessagePluginState(id: string, value: Record<string, any>): Promise<any>;
  updateMessagePluginArguments(id: string, value: string | Record<string, any>): Promise<any>;
  removeMessage(id: string): Promise<any>;
  removeMessages(ids: string[]): Promise<any>;
  removeMessagesByAssistant(assistantId: string, topicId?: string): Promise<any>;
  removeAllMessages(): Promise<any>;
  messageCountToCheckTrace(): Promise<boolean>;
  hasMessages(): Promise<boolean>;
}
