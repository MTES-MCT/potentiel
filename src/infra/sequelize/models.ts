import { sequelizeInstance } from '../../sequelize.config';

import { MakeProjectModel } from './projections/project/project.model';
import { MakeFileModel } from './projections/file/file.model';
import { MakeNotificationModel } from './projections/notification/notification.model';
import { MakeEventStoreModel } from './eventStore/eventStore.model';
import { EventBus } from '@core/domain';

import * as projectionsNextModels from './projectionsNext';
import { GarantiesFinancières } from './projectionsNext/garantiesFinancières';
import { Raccordements } from './projectionsNext/raccordements';
import { User } from './projectionsNext/users';
import { UserProjects } from './projectionsNext/userProjects';

//
// Legacy projections
//

const models = {
  File: MakeFileModel(sequelizeInstance),
  Notification: MakeNotificationModel(sequelizeInstance),
  Project: MakeProjectModel(sequelizeInstance),
  EventStore: MakeEventStoreModel(sequelizeInstance),
};

GarantiesFinancières.hasOne(models.File, {
  foreignKey: 'id',
  sourceKey: 'fichierId',
  as: 'fichier',
});

GarantiesFinancières.hasOne(User, {
  foreignKey: 'id',
  sourceKey: 'envoyéesPar',
  as: 'envoyéesParRef',
});

GarantiesFinancières.hasOne(User, {
  foreignKey: 'id',
  sourceKey: 'validéesPar',
  as: 'validéesParRef',
});

Raccordements.hasOne(models.File, {
  foreignKey: 'id',
  sourceKey: 'ptfFichierId',
  as: 'ptfFichier',
});

Raccordements.hasOne(User, {
  foreignKey: 'id',
  sourceKey: 'ptfEnvoyéePar',
  as: 'ptfEnvoyéeParRef',
});

models.Project.belongsTo(models.File, {
  foreignKey: 'dcrFileId',
  as: 'dcrFileRef',
});

models.Project.belongsTo(models.File, {
  foreignKey: 'certificateFileId',
  as: 'certificateFile',
});

models.Project.hasMany(UserProjects, {
  as: 'users',
  foreignKey: 'projectId',
});

models.Project.hasOne(GarantiesFinancières, {
  as: 'garantiesFinancières',
  foreignKey: 'projetId',
});

models.Project.hasOne(Raccordements, {
  as: 'raccordements',
  foreignKey: 'projetId',
});

// models.ModificationRequest.belongsTo(models.File, {
//   foreignKey: 'fileId',
//   as: 'attachmentFile',
//   constraints: false,
// });

// models.ModificationRequest.belongsTo(models.File, {
//   foreignKey: 'responseFileId',
//   as: 'responseFile',
//   constraints: false,
// });

// models.ModificationRequest.belongsTo(models.Project, {
//   foreignKey: 'projectId',
//   as: 'project',
//   constraints: false,
// });

// models.ModificationRequest.belongsTo(User, {
//   foreignKey: 'userId',
//   as: 'requestedBy',
//   constraints: false,
// });
// models.ModificationRequest.belongsTo(User, {
//   foreignKey: 'respondedBy',
//   as: 'respondedByUser',
//   constraints: false,
// });
// models.ModificationRequest.belongsTo(User, {
//   foreignKey: 'confirmationRequestedBy',
//   as: 'confirmationRequestedByUser',
//   constraints: false,
// });
// models.ModificationRequest.belongsTo(User, {
//   foreignKey: 'cancelledBy',
//   as: 'cancelledByUser',
//   constraints: false,
// });

User.hasMany(models.Project, { as: 'candidateProjects', foreignKey: 'email', sourceKey: 'email' });

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
  if (model.associate) model.associate({ ...models, ...projectionsNextModels });
  if (model.projector) model.projector.initModel(model);
});

const projections = { ...models, ...projectionsNextModels };
export type Projections = typeof projections;

export default projections;
