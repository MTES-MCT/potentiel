import { logger } from '@core/utils';
import { Subscribe } from './projector';
import { initializeGarantiesFinancièresProjector } from './garantiesFinancières/garantiesFinancières.projector';
import { ProjectEventProjector } from './projectEvents/projectEvent.projector';
import { TâchesProjector } from './tâches/tâches.projector';
import { GestionnaireRéseauDétailProjector } from './gestionnairesRéseau/détail/gestionnaireRéseauDétail.projector';
import { GestionnairesRéseauListeProjector } from './gestionnairesRéseau/liste/gestionnairesRéseauListe.projector';
import { ModificationRequestProjector } from './modificationRequest/modificationRequest.projector';
import { ProjectProjector } from './project/project.projector';
import { RaccordementsProjector } from './raccordements/raccordements.projector';
import { UserProjector } from './users/user.projector';
import { UserProjectsProjector } from './userProjects/userProjects.projector';
import { UserProjectClaimsProjector } from './userProjectClaims/userProjectClaims.projector';
import { UserDrealProjector } from './userDreal/userDreal.projector';
import { createProjectoryFactory } from './projector.factory';
import { Sequelize } from 'sequelize';

export const initializeProjectors = (sequelize: Sequelize, subscribe: Subscribe) => {
  const projectorFactory = createProjectoryFactory(sequelize);

  const projectors = [
    ProjectEventProjector,
    TâchesProjector,
    GestionnaireRéseauDétailProjector,
    GestionnairesRéseauListeProjector,
    ModificationRequestProjector,
    ProjectProjector,
    RaccordementsProjector,
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
