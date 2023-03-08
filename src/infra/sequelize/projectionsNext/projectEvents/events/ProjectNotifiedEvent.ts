import { ProjectEvent } from '../projectEvent.model';

export type ProjectNotifiedEvent = ProjectEvent & {
  type: 'ProjectNotified';
  payload: null;
};
