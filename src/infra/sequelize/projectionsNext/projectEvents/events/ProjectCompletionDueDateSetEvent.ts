import { ProjectEvent } from '../projectEvent.model';

export type ProjectCompletionDueDateSetEvent = ProjectEvent & {
  type: 'ProjectCompletionDueDateSet';
  payload: null | { reason: 'délaiCdc2022' };
};
