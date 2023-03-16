import { Sequelize } from 'sequelize';
import { initializeFileModel } from './file/file.initializer';
import {
  initializeGarantiesFinancièresModel,
  initializeGarantiesFinancièresModelAssociations,
} from './garantiesFinancières/garantiesFinancières.initializer';
import { initializeGestionnaireRéseauModel } from './gestionnairesRéseau/gestionnaireRéseau.initializer';
import {
  initializeModificationRequestModel,
  initializeModificationRequestModelAssociations,
} from './modificationRequest/modificationRequest.initializer';
import { initializeNotificationModel } from './notification/notification.initializer';
import {
  initializeProjectModel,
  initializeProjectModelModelAssociations,
} from './project/project.initializer';
import { initializeProjectEventModel } from './projectEvents/projectEvent.initializer';
import {
  initializeRaccordementsModel,
  initializeRaccordementsModelAssociations,
} from './raccordements/raccordements.initializer';
import { initializeTâchesModel } from './tâches/tâches.initializer';
import {
  initializeUserDrealModel,
  initializeUserDrealModelAssociations,
} from './userDreal/userDreal.initializer';
import {
  initializeUserProjectClaimsModel,
  initializeUserProjectClaimsModelAssociations,
} from './userProjectClaims/userProjectClaims.initializer';
import {
  initializeUserProjectsModel,
  initializeUserProjectsModelAssociations,
} from './userProjects/userProjects.initializer';
import { initializeUserModel, initializeUserModelAssociations } from './users/users.initializer';

export const initializeModels = (sequelize: Sequelize) => {
  // First initialize models
  initializeFileModel(sequelize);
  initializeGarantiesFinancièresModel(sequelize);
  initializeGestionnaireRéseauModel(sequelize);
  initializeModificationRequestModel(sequelize);
  initializeNotificationModel(sequelize);
  initializeProjectModel(sequelize);
  initializeProjectEventModel(sequelize);
  initializeRaccordementsModel(sequelize);
  initializeTâchesModel(sequelize);
  initializeUserDrealModel(sequelize);
  initializeUserProjectClaimsModel(sequelize);
  initializeUserProjectsModel(sequelize);
  initializeUserModel(sequelize);

  // Then initialize model associations
  initializeGarantiesFinancièresModelAssociations();
  initializeModificationRequestModelAssociations();
  initializeProjectModelModelAssociations();
  initializeRaccordementsModelAssociations();
  initializeUserDrealModelAssociations();
  initializeUserProjectClaimsModelAssociations();
  initializeUserProjectsModelAssociations();
  initializeUserModelAssociations();
};
