import { Sequelize } from 'sequelize';
import { initializeFileModel } from './file/file.initializer';
import {
  initializeGarantiesFinancièresModel,
  initializeGarantiesFinancièresModelAssociations,
} from './garantiesFinancières/garantiesFinancières.initializer';
import { initializeGestionnaireRéseauDétailModel } from './gestionnairesRéseau/détail/gestionnaireRéseauDétail.initializer';
import { initializeGestionnaireRéseauListe } from './gestionnairesRéseau/liste/gestionnaireRéseauListe.initializer';
import {
  initializeModificationRequestModel,
  initializeModificationRequestModelAssociations,
} from './modificationRequest/modificationRequest.initializer';
import { initializeNotificationModel } from './notification/notification.initializer';
import {
  initializeProjectModel,
  initializeProjectModelModelAssociation,
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
  initializeUserProjects,
  initializeUserProjectsModelAssociations,
} from './userProjects/userProjects.initializer';
import {
  initializeUserModel,
  initializeUserModelAssociations,
} from './users/userModel.initializer';

export const initializeProjections = (sequelize: Sequelize) => {
  initializeModels(sequelize);
  initializeModelAssociations();
};

const initializeModels = (sequelize: Sequelize) => {
  initializeFileModel();
  initializeGarantiesFinancièresModel(sequelize);
  initializeGestionnaireRéseauDétailModel();
  initializeGestionnaireRéseauListe();
  initializeModificationRequestModel();
  initializeNotificationModel();
  initializeProjectModel();
  initializeProjectEventModel();
  initializeRaccordementsModel();
  initializeTâchesModel();
  initializeUserDrealModel();
  initializeUserProjectClaimsModel();
  initializeUserProjects();
  initializeUserModel();
};

const initializeModelAssociations = () => {
  initializeGarantiesFinancièresModelAssociations();
  initializeModificationRequestModelAssociations();
  initializeProjectModelModelAssociation();
  initializeRaccordementsModelAssociations();
  initializeUserDrealModelAssociations();
  initializeUserProjectClaimsModelAssociations();
  initializeUserProjectsModelAssociations();
  initializeUserModelAssociations();
};
