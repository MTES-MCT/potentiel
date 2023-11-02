import { Event } from '../../event';

export type RebuildTriggered = Event & {
  type: 'RebuildTriggered';
  payload: {
    category: string;
    id: string;
  };
};
