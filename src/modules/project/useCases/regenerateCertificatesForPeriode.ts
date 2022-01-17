import { EventBus, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, logger, okAsync, Result, ResultAsync } from '@core/utils'
import { User } from '../../../entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { IllegalProjectDataError, ProjectCannotBeUpdatedIfUnnotifiedError } from '../errors'
import { CertificatesForPeriodeRegenerated } from '../events'
import { Project } from '../Project'
import { GetProjectIdsForPeriode } from '../queries'
import { GenerateCertificate } from './generateCertificate'

interface RegenerateCertificatesForPeriodeDeps {
  eventBus: EventBus
  getProjectIdsForPeriode: GetProjectIdsForPeriode
  projectRepo: TransactionalRepository<Project>
  generateCertificate: GenerateCertificate
}

interface RegenerateCertificatesForPeriodeArgs {
  appelOffreId: string
  periodeId: string
  familleId?: string
  newNotifiedOn?: number
  user: User
  reason?: string
}

export const makeRegenerateCertificatesForPeriode = (
  deps: RegenerateCertificatesForPeriodeDeps
) => (
  args: RegenerateCertificatesForPeriodeArgs
): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
  const { appelOffreId, periodeId, familleId, newNotifiedOn, user, reason } = args

  if (!user || !['admin', 'dgec'].includes(user.role)) {
    return errAsync(new UnauthorizedError())
  }

  return deps
    .getProjectIdsForPeriode({ appelOffreId, periodeId, familleId })
    .andThen((projectIds) =>
      ResultAsync.fromPromise(
        _regenerateCertificatesForProjects(projectIds),
        () => new InfraNotAvailableError()
      )
    )
    .andThen(() =>
      deps.eventBus.publish(
        new CertificatesForPeriodeRegenerated({
          payload: {
            appelOffreId,
            periodeId,
            familleId,
            reason,
            newNotifiedOn,
            requestedBy: user.id,
          },
        })
      )
    )
    .map(() => null)

  async function _regenerateCertificatesForProjects(projectIds: string[]) {
    for (const projectId of projectIds) {
      await _updateNotificationDateIfNecessary(projectId).andThen(() =>
        deps.generateCertificate(projectId, reason).mapErr((e) => {
          logger.info(`regenerateCertificatesForPeriode failed for projectId ${projectId}`)
          logger.error(e)
        })
      )
    }
  }

  function _updateNotificationDateIfNecessary(projectId: string) {
    if (!newNotifiedOn) return okAsync(null)

    return deps.projectRepo.transaction(
      new UniqueEntityID(projectId),
      (
        project: Project
      ): Result<null, ProjectCannotBeUpdatedIfUnnotifiedError | IllegalProjectDataError> => {
        return project.setNotificationDate(user, newNotifiedOn)
      }
    )
  }
}
