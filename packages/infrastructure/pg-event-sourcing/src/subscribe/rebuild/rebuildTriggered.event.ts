import { Event } from '../../event';

export type RebuildAllTriggered = Event & {
  type: 'RebuildTriggered';
  payload: {
    category: string;
    id?: undefined;
  };
};

export type RebuildOneTriggered = Event & {
  type: 'RebuildTriggered';
  payload: {
    category: string;
    id: string;
  };
};

export type RebuildTriggered = Event & {
  type: 'RebuildTriggered';
  payload: RebuildAllTriggered['payload'] | RebuildOneTriggered['payload'];
};

export const isRebuildAllEvent = (event: RebuildTriggered): event is RebuildAllTriggered =>
  event.type === 'RebuildTriggered' && typeof event.payload.id === 'undefined';
