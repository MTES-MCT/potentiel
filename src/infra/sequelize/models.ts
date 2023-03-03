import { sequelizeInstance } from '../../sequelize.config';
import { MakeEventStoreModel } from './eventStore/eventStore.model';
import { EventBus } from '@core/domain';

import * as projectionsNextModels from './projectionsNext';
import { GarantiesFinancières } from './projectionsNext/garantiesFinancières';
import { Raccordements } from './projectionsNext/raccordements';
import { User } from './projectionsNext/users';
import { UserProjects } from './projectionsNext/userProjects';
import { ModificationRequest } from './projectionsNext';
import { GestionnaireRéseauDétail } from './projectionsNext/gestionnairesRéseau';
import { Project } from './projectionsNext/project';

//
// Legacy projections
//

const models = {
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

Raccordements.hasOne(GestionnaireRéseauDétail, {
  foreignKey: 'codeEIC',
  sourceKey: 'codeEICGestionnaireRéseau',
  as: 'gestionnaireRéseauDétail',
});

ModificationRequest.belongsTo(models.File, {
  foreignKey: 'fileId',
  as: 'attachmentFile',
  constraints: false,
});

ModificationRequest.belongsTo(models.File, {
  foreignKey: 'responseFileId',
  as: 'responseFile',
  constraints: false,
});

ModificationRequest.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
  constraints: false,
});

ModificationRequest.belongsTo(User, {
  foreignKey: 'userId',
  as: 'requestedBy',
  constraints: false,
});
ModificationRequest.belongsTo(User, {
  foreignKey: 'respondedBy',
  as: 'respondedByUser',
  constraints: false,
});
ModificationRequest.belongsTo(User, {
  foreignKey: 'confirmationRequestedBy',
  as: 'confirmationRequestedByUser',
  constraints: false,
});
ModificationRequest.belongsTo(User, {
  foreignKey: 'cancelledBy',
  as: 'cancelledByUser',
  constraints: false,
});

Project.belongsTo(models.File, {
  foreignKey: 'dcrFileId',
  as: 'dcrFileRef',
});

Project.belongsTo(models.File, {
  foreignKey: 'certificateFileId',
  as: 'certificateFile',
});

Project.hasMany(UserProjects, {
  as: 'users',
  foreignKey: 'projectId',
});

Project.hasOne(GarantiesFinancières, {
  as: 'garantiesFinancières',
  foreignKey: 'projetId',
});

Project.hasOne(Raccordements, {
  as: 'raccordements',
  foreignKey: 'projetId',
});

User.hasMany(Project, { as: 'candidateProjects', foreignKey: 'email', sourceKey: 'email' });

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
