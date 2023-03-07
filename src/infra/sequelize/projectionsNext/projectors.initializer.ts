import { logger } from '@core/utils';
import { HasSubscribe } from '..';
import { getGarantiesFinancièresProjector } from './garantiesFinancières/garantiesFinancières.projector';
import { ProjectEventProjector } from './projectEvents/projectEvent.model';
import { TâchesProjector } from './tâches/tâches.model';
import { GestionnaireRéseauDétailProjector } from './gestionnairesRéseau/détail/gestionnairesRéseauDétail.model';
import { GestionnairesRéseauListeProjector } from './gestionnairesRéseau/liste/gestionnairesRéseauListe.model';
import { ModificationRequestProjector } from './modificationRequest/modificationRequest.model';
import { ProjectProjector } from './project/project.model';
import { RaccordementsProjector } from './raccordements/raccordements.model';
import { UserProjector } from './users/users.model';
import { UserProjectsProjector } from './userProjects/userProjects.model';
import { UserProjectClaimsProjector } from './userProjectClaims/userProjectClaims.model';
import { UserDrealProjector } from './userDreal/userDreal.model';

export const initializeProjectors = (subscriber: HasSubscribe) => {
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
    projector.initEventStream(subscriber);
    return projector.name;
  });

  logger.info(`Initialized nextgen projectors: ${projectorsNext.join(', ')}`);

  logger.info('Projections initialized');
};
