import { ProjectEvent } from '../projectEvent.model';

export type LegacyModificationFileAttachedEvent = ProjectEvent & {
  type: 'LegacyModificationFileAttached';
  payload: { fileId: string; filename: string };
};
