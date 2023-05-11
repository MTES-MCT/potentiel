import { setupMessageHandlers } from '@potentiel/domain';
import { bootstrapEventConsumers } from './bootstrapEventConsumers';
import { bootstrapEventStreamer } from './bootstrapEventStreamer';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';

export const bootstrap = async () => {
  setupMessageHandlers({
    loadAggregate,
    publish,
    find: findProjection,
    list: listProjection,
  });
  await bootstrapEventStreamer();
  await bootstrapEventConsumers();

  // Third step: launch web
};
