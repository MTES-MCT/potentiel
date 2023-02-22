import models from './models';
import {
  initModificationRequestProjections,
  initProjectProjections,
  initAppelOffreProjections,
} from './projections';
import { EventStore } from '@core/domain';

export { initProjectors } from './models';
export {
  persistEventsToStore,
  loadAggregateEventsFromStore,
  rollbackEventsFromStore,
} from './eventStore';

export const initProjections = (eventStore: EventStore) => {
  initProjectProjections(eventStore, models);
  initModificationRequestProjections(eventStore, models);
  initAppelOffreProjections(eventStore, models);
};

export { HasSubscribe } from './helpers/Projection';
export * from './projectionsNext';
