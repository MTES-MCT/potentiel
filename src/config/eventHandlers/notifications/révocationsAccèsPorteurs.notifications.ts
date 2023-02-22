import { notificationEventSubscriber } from './notificationEventSubscriber';
import {
  makeOnToutAccèsAuProjetRévoqué,
  makeOnUserRightsToProjectRevoked,
} from '@modules/notification';
import { notifierPorteurRévocationAccèsProjet } from '@config/useCases.config';
import { ToutAccèsAuProjetRevoqué, UserRightsToProjectRevoked } from '@modules/authZ';
import { projectRepo, userRepo } from '@dataAccess';

notificationEventSubscriber(
  ToutAccèsAuProjetRevoqué,
  makeOnToutAccèsAuProjetRévoqué({
    notifierPorteurRévocationAccèsProjet,
    getProjectUsers: projectRepo.getUsers,
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
