import { sequelizeInstance } from '../../sequelize.config'

import { MakeProjectModel } from './projections/project/project.model'
import { MakeFileModel } from './projections/file/file.model'
import { MakeNotificationModel } from './projections/notification/notification.model'
import { MakeEventStoreModel } from './eventStore/eventStore.model'
import { MakeUserModel } from './projections/user/user.model'
import { MakeProjectStepModel } from './projections/projectStep/projectStep.model'

import { MakeUserProjectsModel } from './projections/userProjects/userProjects.model'
import { MakeUserDrealModel } from './projections/userDreal/userDreal.model'
import { MakeModificationRequestModel } from './projections/modificationRequest/modificationRequest.model'
import { MakeAppelOffreModel } from './projections/appelOffre/appelOffre.model'
import { MakePeriodeModel } from './projections/appelOffre/periode.model'
import { MakeCredentialsModel } from './projections/user/credentials.model'
import { MakeUserProjectClaimsModel } from './projections'
import { EventBus } from '@core/domain'

import * as projectionsNextModels from './projectionsNext'

//
// Legacy projections
//

export const models = {
  File: MakeFileModel(sequelizeInstance),
  Notification: MakeNotificationModel(sequelizeInstance),
  Project: MakeProjectModel(sequelizeInstance),
  EventStore: MakeEventStoreModel(sequelizeInstance),
  ModificationRequest: MakeModificationRequestModel(sequelizeInstance),
  User: MakeUserModel(sequelizeInstance),
  UserProjects: MakeUserProjectsModel(sequelizeInstance),
  ProjectStep: MakeProjectStepModel(sequelizeInstance),
  AppelOffre: MakeAppelOffreModel(sequelizeInstance),
  Periode: MakePeriodeModel(sequelizeInstance),
  UserDreal: MakeUserDrealModel(sequelizeInstance),
  Credentials: MakeCredentialsModel(sequelizeInstance),
  UserProjectClaims: MakeUserProjectClaimsModel(sequelizeInstance),
}

// Link projectors with the eventBus (called by the application config)
export const initProjectors = (eventBus: EventBus) => {
  const initializedProjectors: string[] = []
  Object.values(models).forEach((model) => {
    if (model.projector) {
      model.projector.initEventBus(eventBus)
      initializedProjectors.push(model.getTableName())
    }
  })

  return initializedProjectors
}

// Create associations and link projectors to their model
Object.values(models).forEach((model) => {
  model.associate({ ...models, ...projectionsNextModels })
  if (model.projector) model.projector.initModel(model)
})

projectionsNextModels.GarantiesFinancières.hasOne(models.File, {
  foreignKey: 'id',
  sourceKey: 'fichierId',
  as: 'fichier',
})

projectionsNextModels.GarantiesFinancières.hasOne(models.User, {
  foreignKey: 'id',
  sourceKey: 'envoyéesPar',
  as: 'envoyéesParRef',
})

const projections = { ...models, ...projectionsNextModels }
export type Projections = typeof projections

export default projections
