import { ProjectEvent } from '../projectEvent.model';

export type ProjectNotificationDateSetEvent = ProjectEvent & {
  type: 'ProjectNotificationDateSet';
  payload: null;
};
