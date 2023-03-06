import { Sequelize } from 'sequelize';
import { initFileModel } from './file/initFileModel';
import {
  initGarantiesFinancièresModel,
  initGarantiesFinancièresModelAssociations,
} from './garantiesFinancières/garantiesFinancières.initializer';
import { initGestionnaireRéseauDétailModel } from './gestionnairesRéseau/détail/initGestionnaireRéseauDétailModel';
import { initGestionnaireRéseauListe } from './gestionnairesRéseau/liste/initGestionnaireRéseauListe';
import { initModificationRequestModelAssociations } from './modificationRequest/initModificationRequestAssociations';
import { initModificationRequestModel } from './modificationRequest/initModificationRequestModel';
import { initNotificationModel } from './notification/initNotificationModel';
import { initProjectModelModelAssociation } from './project/initProjectAssociation';
import { initProjectModel } from './project/initProjectModel';
import { initProjectEventModel } from './projectEvents/initProjectEventModel';
import { initRaccordementsModelAssociations } from './raccordements/initRaccordementsAssociations';
import { initRaccordementsModel } from './raccordements/initRaccordementsModel';
import { initTâchesModel } from './tâches/initTâchesModel';
import { initUserDrealModelAssociations } from './userDreal/initUserDrealAssociations';
import { initUserDrealModel } from './userDreal/initUserDrealModel';
import { initUserProjectClaimsModelAssociations } from './userProjectClaims/initUserProjectClaimsAssociations';
import { initUserProjectClaimsModel } from './userProjectClaims/initUserProjectClaimsModel';
import { initUserProjects } from './userProjects/initUserProjects';
import { initUserProjectsModelAssociations } from './userProjects/initUserProjectsAssociations';
import { initUserModel } from './users/initUserModel';
import { initUserModelAssociations } from './users/initUserModelAssociations';

export const initModels = (sequelize: Sequelize) => {
  initFileModel();
  initGarantiesFinancièresModel(sequelize);
  initGestionnaireRéseauDétailModel();
  initGestionnaireRéseauListe();
  initModificationRequestModel();
  initNotificationModel();
  initProjectModel();
  initProjectEventModel();
  initRaccordementsModel();
  initTâchesModel();
  initUserDrealModel();
  initUserProjectClaimsModel();
  initUserProjects();
  initUserModel();

  initGarantiesFinancièresModelAssociations();
  initModificationRequestModelAssociations();
  initProjectModelModelAssociation();
  initRaccordementsModelAssociations();
  initUserDrealModelAssociations();
  initUserProjectClaimsModelAssociations();
  initUserProjectsModelAssociations();
  initUserModelAssociations();
};
