import { Sequelize } from 'sequelize';
import { initializeFileModel } from './file/file.initializer';

import { initializeNotificationModel } from './notification/notification.initializer';
import {
  initializeProjectModel,
  initializeProjectModelModelAssociations,
} from './project/project.initializer';
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

  initializeNotificationModel(sequelize);
  initializeProjectModel(sequelize);
  initializeUserDrealModel(sequelize);
  initializeUserProjectsModel(sequelize);
  initializeUserModel(sequelize);

  // Then initialize model associations
  initializeProjectModelModelAssociations();
  initializeUserDrealModelAssociations();
  initializeUserProjectsModelAssociations();
  initializeUserModelAssociations();
};
