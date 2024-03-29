import { notificationEventSubscriber } from './notificationEventSubscriber';
import {
  makeOnToutAccèsAuProjetRévoqué,
  makeOnUserRightsToProjectRevoked,
} from '../../../modules/notification';
import { notifierPorteurRévocationAccèsProjet } from '../../useCases.config';
import { ToutAccèsAuProjetRevoqué, UserRightsToProjectRevoked } from '../../../modules/authZ';
import { projectRepo, userRepo } from '../../../dataAccess';
import { récupérerDonnéesPorteursParProjetQueryHandler } from '../../queries.config';

notificationEventSubscriber(
  ToutAccèsAuProjetRevoqué,
  makeOnToutAccèsAuProjetRévoqué({
    notifierPorteurRévocationAccèsProjet,
    getProjectUsers: récupérerDonnéesPorteursParProjetQueryHandler,
    getProject: projectRepo.findById,
  }),
);

notificationEventSubscriber(
  UserRightsToProjectRevoked,
  makeOnUserRightsToProjectRevoked({
    notifierPorteurRévocationAccèsProjet,
    getUser: userRepo.findById,
    getProject: projectRepo.findById,
  }),
);
