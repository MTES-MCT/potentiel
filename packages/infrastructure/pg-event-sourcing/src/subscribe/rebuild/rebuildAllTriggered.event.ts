import { Event } from '../../event';

export type RebuildAllTriggered = Event & {
  type: 'RebuildAllTriggered';
  payload: {
    category: string;
  };
};
