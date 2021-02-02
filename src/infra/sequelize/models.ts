import { sequelizeInstance } from '../../sequelize.config'

import { MakeProjectModel } from './projections/project/project.model'
import { MakeFileModel } from './projections/file/file.model'
import { MakeNotificationModel } from './projections/notification/notification.model'
import { MakeEventStoreModel } from './eventStore/eventStore.model'
import { MakeUserModel } from './projections/user/user.model'
import { MakeUserProjectsModel } from './projections/userProjects/userProjects.model'
import { MakeModificationRequestModel } from './projections/modificationRequest/modificationRequest.model'

const models = {
  File: MakeFileModel(sequelizeInstance),
  Notification: MakeNotificationModel(sequelizeInstance),
  Project: MakeProjectModel(sequelizeInstance),
  EventStore: MakeEventStoreModel(sequelizeInstance),
  ModificationRequest: MakeModificationRequestModel(sequelizeInstance),
  User: MakeUserModel(sequelizeInstance),
  UserProjects: MakeUserProjectsModel(sequelizeInstance),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
