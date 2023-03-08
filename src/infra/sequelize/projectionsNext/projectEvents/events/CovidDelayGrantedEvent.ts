import { ProjectEvent } from '../projectEvent.model';

export type CovidDelayGrantedEvent = ProjectEvent & {
  type: 'CovidDelayGranted';
  payload: null;
};
