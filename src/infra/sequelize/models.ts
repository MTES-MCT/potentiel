import { sequelize } from '../../sequelize.config'

import { MakeProjectModel } from './projections/project/project.model'
import { MakeFileModel } from './projections/file/file.model'
import { MakeNotificationModel } from './projections/notification/notification.model'
import { MakeEventStoreModel } from './eventStore/eventStore.model'
import { MakeUserModel } from './projections/user/user.model'
import { MakeModificationRequestModel } from './projections/modificationRequest/modificationRequest.model'

const models = {
  File: MakeFileModel(sequelize),
  Notification: MakeNotificationModel(sequelize),
  Project: MakeProjectModel(sequelize),
  EventStore: MakeEventStoreModel(sequelize),
  ModificationRequest: MakeModificationRequestModel(sequelize),
  User: MakeUserModel(sequelize),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
