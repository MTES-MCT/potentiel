import { sequelizeInstance } from '../../sequelize.config';
import { MakeEventStoreModel } from './eventStore/eventStore.model';
import { EventBus } from '@core/domain';
//
// Legacy projections
//

const models = {
  EventStore: MakeEventStoreModel(sequelizeInstance),
};

// Link projectors with the eventBus (called by the application config)
export const initProjectors = (eventBus: EventBus) => {
  const initializedProjectors: string[] = [];
  Object.values(models).forEach((model) => {
    if (model.projector) {
      model.projector.initEventBus(eventBus);
      initializedProjectors.push(model.getTableName());
    }
  });

  return initializedProjectors;
};

// Create associations and link projectors to their model
Object.values(models).forEach((model) => {
  if (model.associate) model.associate({ ...models });
  if (model.projector) model.projector.initModel(model);
});

const projections = { ...models };

export default projections;
