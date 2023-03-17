import { subscribe } from '@potentiel/pg-event-sourcing';

export const bootstrap = async () => {
  // First step: initialize projection

  // Second step: launch event stream subscriber
  await subscribe('all', async (event) => {
    await publishToRedis(event);
  });

  // Third step: launch web
};
