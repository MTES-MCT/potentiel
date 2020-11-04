import { sequelize } from '../../sequelize.config'

import { MakeFileModel, MakeNotificationModel, MakeProjectModel } from './projections'
import { MakeEventStoreModel } from './eventStore'

const models = {
  File: MakeFileModel(sequelize),
  Notification: MakeNotificationModel(sequelize),
  Project: MakeProjectModel(sequelize),
  EventStore: MakeEventStoreModel(sequelize),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
