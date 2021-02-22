import { sequelizeInstance } from '../../sequelize.config'

import { MakeProjectModel } from './projections/project/project.model'
import { MakeFileModel } from './projections/file/file.model'
import { MakeNotificationModel } from './projections/notification/notification.model'
import { MakeEventStoreModel } from './eventStore/eventStore.model'
import { MakeUserModel } from './projections/user/user.model'
import { MakeProjectStepModel } from './projections/projectStep/projectStep.model'

import { MakeUserProjectsModel } from './projections/userProjects/userProjects.model'
import { MakeProjectAdmissionKeyModel } from './projections/projectAdmissionKey/projectAdmissionKey.model'
import { MakeModificationRequestModel } from './projections/modificationRequest/modificationRequest.model'

const models = {
  File: MakeFileModel(sequelizeInstance),
  Notification: MakeNotificationModel(sequelizeInstance),
  Project: MakeProjectModel(sequelizeInstance),
  EventStore: MakeEventStoreModel(sequelizeInstance),
  ModificationRequest: MakeModificationRequestModel(sequelizeInstance),
  User: MakeUserModel(sequelizeInstance),
  UserProjects: MakeUserProjectsModel(sequelizeInstance),
  ProjectAdmissionKey: MakeProjectAdmissionKeyModel(sequelizeInstance),
  ProjectStep: MakeProjectStepModel(sequelizeInstance),
}

// Create associations
Object.values(models).forEach((model) => model.associate(models))

export default models
