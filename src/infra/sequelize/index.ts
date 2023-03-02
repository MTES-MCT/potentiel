export { initProjectors } from './models';
export {
  persistEventsToStore,
  loadAggregateEventsFromStore,
  rollbackEventsFromStore,
} from './eventStore';

export const initProjections = () => {
  // TODO: Finally empty \o/ ... we can remove the memory projector system now ;)
};

export { HasSubscribe } from './helpers/Projection';
export * from './projectionsNext';
