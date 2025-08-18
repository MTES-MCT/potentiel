import { logger } from '../../../core/utils';
import { Subscribe } from './subscribe';
import { ProjectProjector } from './project/project.projector';
import { UserProjector } from './users/user.projector';
import { UserProjectsProjector } from './userProjects/userProjects.projector';
import { UserDrealProjector } from './userDreal/userDreal.projector';
import { Sequelize } from 'sequelize';

export const initializeProjectors = (sequelize: Sequelize, subscribe: Subscribe) => {
  const projectors = [ProjectProjector, UserProjector, UserProjectsProjector, UserDrealProjector];

  for (const projector of projectors) {
    projector.initialize(subscribe);
  }

  logger.info('Projectors initialized');
};
