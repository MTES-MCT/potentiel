import { sequelizeInstance } from '../../sequelize.config';
import { MakeEventStoreModel } from './eventStore/eventStore.model';
//
// Legacy projections
//

const models = {
  EventStore: MakeEventStoreModel(sequelizeInstance),
};

const projections = { ...models };

export default projections;
