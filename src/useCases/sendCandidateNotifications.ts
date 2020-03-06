import { CandidateNotification, makeCandidateNotification } from '../entities'
import { ProjectRepo, CandidateNotificationRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  candidateNotificationRepo: CandidateNotificationRepo
}

interface CallUseCaseProps {}

export default function makeSendCandidateNotifications({
  projectRepo,
  candidateNotificationRepo
}: MakeUseCaseProps) {
  return async function sendCandidateNotifications({}: CallUseCaseProps): Promise<
    void
  > {
    // Find all projects that have not been notified
    const unNotifiedProjects = await projectRepo.findAll({
      hasBeenNotified: false
    })

    // TODO: send error if there are no unnotified projects

    console.log('unNotifiedProjects', unNotifiedProjects)

    // Create a new CandidateNotification for each
    const notifications: Array<CandidateNotification> = unNotifiedProjects
      .map(project => ({
        projectId: project.id,
        template: project.classe === 'Classé' ? 'laureat' : 'elimination'
      }))
      .map(makeCandidateNotification)

    console.log('notifications', notifications)

    try {
      await candidateNotificationRepo.insertMany(notifications)

      // update unNotifed projects
      await Promise.all(
        unNotifiedProjects.map(project =>
          projectRepo.update({
            ...project,
            hasBeenNotified: true
          })
        )
      )
    } catch (e) {
      console.log('sendCandidateNotifications error', e)
      throw 'Updating notifications and or projects has failed'
    }
  }
}
