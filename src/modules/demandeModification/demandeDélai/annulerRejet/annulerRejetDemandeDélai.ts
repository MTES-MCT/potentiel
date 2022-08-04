import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { DemandeDélai } from '../DemandeDélai'
import { RejetDemandeDélaiAnnulé } from '../events/RejetDemandeDélaiAnnulé'

type AnnulerRejetDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerRejetDemandeDélai = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}) => AnnulerRejetDemandeDélai

export const makeAnnulerRejetDemandeDélai: MakeAnnulerRejetDemandeDélai =
  ({ shouldUserAccessProject, demandeDélaiRepo, publishToEventStore }) =>
  ({ user, demandeDélaiId }) => {
    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai
      if (!projetId) {
        return errAsync(new InfraNotAvailableError())
      }

      return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
        (userHasRightsToProject) => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError())
          }
          if (statut === 'refusée') {
            return publishToEventStore(
              new RejetDemandeDélaiAnnulé({
                payload: { demandeDélaiId, projetId, annuléPar: user.id },
              })
            )
          }
          return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(statut || 'inconnu'))
        }
      )
    })
  }
