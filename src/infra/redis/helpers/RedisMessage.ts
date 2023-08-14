import { Event } from '@potentiel/pg-event-sourcing';

type LegacyEventMessage = {
  type: string;
  payload: Record<string, any>;
  occurredAt: number;
};

export type RedisMessage = LegacyEventMessage | Event;

export const isLegacyEvent = (value: any): value is LegacyEventMessage => {
  return !!value.occurredAt;
};
