import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
import { RejetDélaiAnnulé } from '../events'

type AnnulerRejetRecours = (commande: {
  user: User
  demandeRecoursId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerRejetRecours = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  modificationRequestRepo: TransactionalRepository<ModificationRequest>
  publishToEventStore: EventStore['publish']
}) => AnnulerRejetRecours

export const makeAnnulerRejetRecours: MakeAnnulerRejetRecours =
  ({ shouldUserAccessProject, publishToEventStore, modificationRequestRepo }) =>
  ({ user, demandeRecoursId }) => {
    return modificationRequestRepo.transaction(
      new UniqueEntityID(demandeRecoursId),
      (demandeDélai) => {
        const { status, projectId } = demandeDélai
        if (!projectId) {
          return errAsync(new InfraNotAvailableError())
        }

        return wrapInfra(
          shouldUserAccessProject({ projectId: projectId.toString(), user })
        ).andThen((userHasRightsToProject) => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError())
          }
          if (status === 'rejetée') {
            return publishToEventStore(
              new RejetRecoursAnnulé({
                payload: { demandeRecoursId, projetId: projectId, annuléPar: user.id },
              })
            )
          }
          return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(status || 'inconnu'))
        })
      }
    )
  }
