import { subscribe } from '@potentiel/pg-event-sourcing';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';

export const bootstrapEventStreamer = async () => {
  await subscribe('all', async (event) => {
    await publishToEventBus(event.type, event);
  });
};
