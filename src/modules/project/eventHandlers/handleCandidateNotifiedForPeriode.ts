import {
  errAsync,
  fromOldResult,
  fromOldResultAsync,
  ResultAsync,
} from '../../../core/utils'
import { ProjectAdmissionKeyRepo } from '../../../dataAccess'
import { makeProjectAdmissionKey, ProjectAdmissionKey } from '../../../entities'
import routes from '../../../routes'
import { GetPeriodeTitle } from '../../appelOffre'
import { EventStore } from '../../eventStore/EventStore'
import { NotificationService } from '../../notification'
import { OtherError } from '../../shared'
import { CandidateNotificationForPeriodeFailed } from '../events'
import { CandidateNotifiedForPeriode } from '../events/CandidateNotifiedForPeriode'

export const handleCandidateNotifiedForPeriode = (
  eventStore: EventStore,
  deps: {
    sendNotification: NotificationService['sendNotification']
    saveProjectAdmissionKey: ProjectAdmissionKeyRepo['save']
    getPeriodeTitle: GetPeriodeTitle
  }
) => {
  const { sendNotification, saveProjectAdmissionKey, getPeriodeTitle } = deps

  eventStore.subscribe(CandidateNotifiedForPeriode.type, callback)

  async function callback(event: CandidateNotifiedForPeriode) {
    // console.log('handleCandidateNotifiedForPeriode')
    const {
      payload: { periodeId, appelOffreId, candidateEmail, candidateName },
      requestId,
    } = event

    const notificationResult = await _sendCandidateNotification()

    if (notificationResult.isErr()) {
      eventStore.publish(
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
      let projectAdmissionKey: ProjectAdmissionKey | undefined = undefined
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
          return fromOldResultAsync(
            saveProjectAdmissionKey(_projectAdmissionKey)
          )
        })
        .andThen(() => getPeriodeTitle(appelOffreId, periodeId))
        .andThen(({ periodeTitle, appelOffreTitle }) => {
          const subject = `Résultats de la ${periodeTitle} période de l'appel d'offres ${appelOffreTitle}`

          if (!projectAdmissionKey)
            return errAsync(new OtherError('Impossibru!!!')) // Not actually possible because of chaining above

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
            (e: any) => new OtherError(e.message)
          )
        })
    }
  }
}
