import { ProjectEvent } from '../projectEvent.model';

export type ProjectImportedEvent = ProjectEvent & {
  type: 'ProjectImported';
  payload: { notifiedOn: number };
};
