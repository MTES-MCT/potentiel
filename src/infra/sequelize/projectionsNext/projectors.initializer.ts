import { logger } from '@core/utils';
import { Subscribe } from './subscribe';
import { initializeGarantiesFinancièresProjector } from './garantiesFinancières/garantiesFinancières.projector';
import { ProjectEventProjector } from './projectEvents/projectEvent.projector';
import { TâchesProjector } from './tâches/tâches.projector';
import { ModificationRequestProjector } from './modificationRequest/modificationRequest.projector';
import { ProjectProjector } from './project/project.projector';
import { UserProjector } from './users/user.projector';
import { UserProjectsProjector } from './userProjects/userProjects.projector';
import { UserProjectClaimsProjector } from './userProjectClaims/userProjectClaims.projector';
import { UserDrealProjector } from './userDreal/userDreal.projector';
import { createProjectorFactory } from './projector.factory';
import { Sequelize } from 'sequelize';

export const initializeProjectors = (sequelize: Sequelize, subscribe: Subscribe) => {
  const projectorFactory = createProjectorFactory(sequelize);

  const projectors = [
    ProjectEventProjector,
    TâchesProjector,
    ModificationRequestProjector,
    ProjectProjector,
    UserProjector,
    UserProjectsProjector,
    UserProjectClaimsProjector,
    UserDrealProjector,
    initializeGarantiesFinancièresProjector(projectorFactory),
  ];

  for (const projector of projectors) {
    projector.initialize(subscribe);
  }

  logger.info('Projectors initialized');
};
