import { subscribe } from '@potentiel/pg-event-sourcing';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';

export const bootstrap = async () => {
  // First step: initialize projection

  // Second step: launch event stream subscriber
  await subscribe('all', async (event) => {
    await publishToEventBus(event.type, event);
  });

  // Third step: launch web
};
