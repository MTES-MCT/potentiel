import { sequelizeInstance } from '../../sequelize.config'

import { MakeProjectModel } from './projections/project/project.model'
import { MakeFileModel } from './projections/file/file.model'
import { MakeNotificationModel } from './projections/notification/notification.model'
import { MakeEventStoreModel } from './eventStore/eventStore.model'
import { MakeUserModel } from './projections/user/user.model'

import { MakeUserProjectsModel } from './projections/userProjects/userProjects.model'
import { MakeUserDrealModel } from './projections/userDreal/userDreal.model'
import { MakeModificationRequestModel } from './projections/modificationRequest/modificationRequest.model'
import { MakeAppelOffreModel } from './projections/appelOffre/appelOffre.model'
import { MakePeriodeModel } from './projections/appelOffre/periode.model'
import { EventBus } from '@core/domain'

import * as projectionsNextModels from './projectionsNext'
import { GarantiesFinancières } from './projectionsNext/garantiesFinancières'
import { Raccordements } from './projectionsNext'

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
  AppelOffre: MakeAppelOffreModel(sequelizeInstance),
  Periode: MakePeriodeModel(sequelizeInstance),
  UserDreal: MakeUserDrealModel(sequelizeInstance),
}

GarantiesFinancières.hasOne(models.File, {
  foreignKey: 'id',
  sourceKey: 'fichierId',
  as: 'fichier',
})

GarantiesFinancières.hasOne(models.User, {
  foreignKey: 'id',
  sourceKey: 'envoyéesPar',
  as: 'envoyéesParRef',
})

GarantiesFinancières.hasOne(models.User, {
  foreignKey: 'id',
  sourceKey: 'validéesPar',
  as: 'validéesParRef',
})

Raccordements.hasOne(models.File, {
  foreignKey: 'id',
  sourceKey: 'ptfFichierId',
  as: 'ptfFichier',
})

Raccordements.hasOne(models.User, {
  foreignKey: 'id',
  sourceKey: 'ptfEnvoyéePar',
  as: 'ptfEnvoyéeParRef',
})

models.Project.belongsTo(models.File, {
  foreignKey: 'dcrFileId',
  as: 'dcrFileRef',
})

models.Project.belongsTo(models.File, {
  foreignKey: 'certificateFileId',
  as: 'certificateFile',
})

models.Project.hasMany(models.UserProjects, {
  as: 'users',
  foreignKey: 'projectId',
})

models.Project.hasOne(GarantiesFinancières, {
  as: 'garantiesFinancières',
  foreignKey: 'projetId',
})

models.Project.hasOne(Raccordements, {
  as: 'raccordements',
  foreignKey: 'projetId',
})

models.ModificationRequest.belongsTo(models.File, {
  foreignKey: 'fileId',
  as: 'attachmentFile',
  constraints: false,
})

models.ModificationRequest.belongsTo(models.File, {
  foreignKey: 'responseFileId',
  as: 'responseFile',
  constraints: false,
})

models.ModificationRequest.belongsTo(models.Project, {
  foreignKey: 'projectId',
  as: 'project',
  constraints: false,
})

models.ModificationRequest.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'requestedBy',
  constraints: false,
})
models.ModificationRequest.belongsTo(models.User, {
  foreignKey: 'respondedBy',
  as: 'respondedByUser',
  constraints: false,
})
models.ModificationRequest.belongsTo(models.User, {
  foreignKey: 'confirmationRequestedBy',
  as: 'confirmationRequestedByUser',
  constraints: false,
})
models.ModificationRequest.belongsTo(models.User, {
  foreignKey: 'cancelledBy',
  as: 'cancelledByUser',
  constraints: false,
})

models.UserProjects.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'user',
  constraints: false,
})

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
  if (model.associate) model.associate({ ...models, ...projectionsNextModels })
  if (model.projector) model.projector.initModel(model)
})

const projections = { ...models, ...projectionsNextModels }
export type Projections = typeof projections

export default projections
