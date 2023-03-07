import { logger } from '@core/utils';
import { Subscribe } from './projector';
import { getGarantiesFinancièresProjector } from './garantiesFinancières/garantiesFinancières.projector';
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

export const initializeProjectors = (subscribe: Subscribe) => {
  const projectorsNext = [
    ProjectEventProjector,
    TâchesProjector,
    getGarantiesFinancièresProjector(),
    GestionnaireRéseauDétailProjector,
    GestionnairesRéseauListeProjector,
    ModificationRequestProjector,
    ProjectProjector,
    RaccordementsProjector,
    UserProjector,
    UserProjectsProjector,
    UserProjectClaimsProjector,
    UserDrealProjector,
  ].map((projector) => {
    projector.initialize(subscribe);
    return projector.name;
  });

  logger.info(`Initialized nextgen projectors: ${projectorsNext.join(', ')}`);

  logger.info('Projections initialized');
};
