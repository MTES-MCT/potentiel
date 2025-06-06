import { Sequelize } from 'sequelize';
import { initializeFileModel } from './file/file.initializer';
import {
  initializeModificationRequestModel,
  initializeModificationRequestModelAssociations,
} from './modificationRequest/modificationRequest.initializer';
import { initializeNotificationModel } from './notification/notification.initializer';
import {
  initializeProjectModel,
  initializeProjectModelModelAssociations,
} from './project/project.initializer';
import { initializeTâchesModel } from './tâches/tâches.initializer';
import {
  initializeUserDrealModel,
  initializeUserDrealModelAssociations,
} from './userDreal/userDreal.initializer';

import {
  initializeUserProjectsModel,
  initializeUserProjectsModelAssociations,
} from './userProjects/userProjects.initializer';
import { initializeUserModel, initializeUserModelAssociations } from './users/users.initializer';

export const initializeModels = (sequelize: Sequelize) => {
  // First initialize models
  initializeFileModel(sequelize);

  initializeModificationRequestModel(sequelize);
  initializeNotificationModel(sequelize);
  initializeProjectModel(sequelize);
  initializeTâchesModel(sequelize);
  initializeUserDrealModel(sequelize);
  initializeUserProjectsModel(sequelize);
  initializeUserModel(sequelize);

  // Then initialize model associations

  initializeModificationRequestModelAssociations();
  initializeProjectModelModelAssociations();
  initializeUserDrealModelAssociations();
  initializeUserProjectsModelAssociations();
  initializeUserModelAssociations();
};
