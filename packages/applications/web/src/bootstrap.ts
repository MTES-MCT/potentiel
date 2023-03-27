import { bootstrapEventConsumers } from './bootstrapEventConsumers';
import { bootstrapEventStreamer } from './bootstrapEventStreamer';

export const bootstrap = async () => {
  await bootstrapEventStreamer();
  await bootstrapEventConsumers();

  // Third step: launch web
};
