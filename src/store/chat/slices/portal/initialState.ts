import { PortalArtifact } from '@/types/artifact';

export interface PortalFile {
  chunkId?: string;
  chunkText?: string;
  fileId: string;
}

export interface ChatPortalState {
  portalArtifact?: PortalArtifact;
  portalArtifactDisplayMode?: 'code' | 'preview';
  portalFile?: PortalFile;
  portalMessageDetail?: string;
  portalThreadId?: string;
  portalToolMessage?: { id: string; identifier: string };
  showPortal: boolean;
}

export const initialChatPortalState: ChatPortalState = {
  portalArtifactDisplayMode: 'preview',
  showPortal: false,
};
