import { Sequelize } from 'sequelize';
import { initializeFileModel } from './file/file.initializer';
import {
  initializeGarantiesFinancièresModel,
  initializeGarantiesFinancièresModelAssociations,
} from './garantiesFinancières/garantiesFinancières.initializer';
import { initializeGestionnaireRéseauDétailModel } from './gestionnairesRéseau/détail/gestionnaireRéseauDétail.initializer';
import { initializeGestionnaireRéseauListeModel } from './gestionnairesRéseau/liste/gestionnaireRéseauListe.initializer';
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

export const initializeProjections = (sequelize: Sequelize) => {
  initializeModels(sequelize);
  initializeModelAssociations();
};

const initializeModels = (sequelize: Sequelize) => {
  initializeFileModel(sequelize);
  initializeGarantiesFinancièresModel(sequelize);
  initializeGestionnaireRéseauDétailModel(sequelize);
  initializeGestionnaireRéseauListeModel(sequelize);
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
};

const initializeModelAssociations = () => {
  initializeGarantiesFinancièresModelAssociations();
  initializeModificationRequestModelAssociations();
  initializeProjectModelModelAssociations();
  initializeRaccordementsModelAssociations();
  initializeUserDrealModelAssociations();
  initializeUserProjectClaimsModelAssociations();
  initializeUserProjectsModelAssociations();
  initializeUserModelAssociations();
};
