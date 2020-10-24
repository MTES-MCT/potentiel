import { errAsync, fromOldResult, fromOldResultAsync, ResultAsync } from '../../../core/utils'
import { ProjectAdmissionKeyRepo } from '../../../dataAccess'
import { makeProjectAdmissionKey, ProjectAdmissionKey } from '../../../entities'
import routes from '../../../routes'
import { GetPeriodeTitle } from '../../appelOffre'
import { EventBus } from '../../eventStore'
import { NotificationService } from '../../notification'
import { OtherError } from '../../shared'
import { CandidateNotificationForPeriodeFailed } from '../events'
import { CandidateNotifiedForPeriode } from '../events/CandidateNotifiedForPeriode'

export const handleCandidateNotifiedForPeriode = (deps: {
  eventBus: EventBus
  sendNotification: NotificationService['sendNotification']
  saveProjectAdmissionKey: ProjectAdmissionKeyRepo['save']
  getPeriodeTitle: GetPeriodeTitle
}) => async (event: CandidateNotifiedForPeriode) => {
  const { eventBus, sendNotification, saveProjectAdmissionKey, getPeriodeTitle } = deps
  const {
    payload: { periodeId, appelOffreId, candidateEmail, candidateName },
    requestId,
  } = event

  const notificationResult = await _sendCandidateNotification()

  if (notificationResult.isErr()) {
    await eventBus.publish(
      new CandidateNotificationForPeriodeFailed({
        payload: {
          candidateEmail,
          periodeId,
          appelOffreId,
          error: notificationResult.error.message,
        },
        requestId,
      })
    )
  }

  function _sendCandidateNotification(): ResultAsync<null, Error> {
    let projectAdmissionKey: ProjectAdmissionKey | undefined
    return fromOldResult(
      makeProjectAdmissionKey({
        email: candidateEmail,
        fullName: candidateName,
        appelOffreId,
        periodeId,
      })
    )
      .asyncAndThen((_projectAdmissionKey) => {
        projectAdmissionKey = _projectAdmissionKey
        return fromOldResultAsync(saveProjectAdmissionKey(_projectAdmissionKey))
      })
      .andThen(() => getPeriodeTitle(appelOffreId, periodeId))
      .andThen(({ periodeTitle, appelOffreTitle }) => {
        const subject = `Résultats de la ${periodeTitle} période de l'appel d'offres ${appelOffreTitle}`

        if (!projectAdmissionKey) return errAsync(new OtherError('Impossibru!!!')) // Not actually possible because of chaining above

        return ResultAsync.fromPromise(
          sendNotification({
            type: 'designation',
            context: {
              projectAdmissionKeyId: projectAdmissionKey.id,
              appelOffreId,
              periodeId,
            },
            variables: {
              invitation_link: routes.PROJECT_INVITATION({
                projectAdmissionKey: projectAdmissionKey.id,
              }),
            },
            message: {
              subject,
              email: candidateEmail,
              name: candidateName,
            },
          }),
          (e: any) => {
            return new OtherError(e.message)
          }
        )
      })
  }
}
