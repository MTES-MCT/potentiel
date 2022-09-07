import { notificationEventSubscriber } from './notificationEventSubscriber'
import { makeOnToutAccèsAuProjetRévoqué } from '@modules/notification'
import { notifierPorteurRévocationAccèsProjet } from '@config/useCases.config'
import { ToutAccèsAuProjetRevoqué } from '@modules/authZ'
import { projectRepo } from '@dataAccess'

notificationEventSubscriber(
  ToutAccèsAuProjetRevoqué,
  makeOnToutAccèsAuProjetRévoqué({
    notifierPorteurRévocationAccèsProjet,
    getProjectUsers: projectRepo.getUsers,
    getProject: projectRepo.findById,
  })
)
