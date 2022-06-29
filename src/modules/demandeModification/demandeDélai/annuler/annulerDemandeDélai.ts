import { User } from '@entities'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { StatusPreventsCancellingError } from '@modules/modificationRequest'
import { DélaiAnnulé } from '@modules/demandeModification'

type AnnulerDemandeDélai = (commande: {
  projectId: string
  user: User
  demandeDélaiId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerDemandeDélai = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}) => AnnulerDemandeDélai

export const makeAnnulerDemandeDélai: MakeAnnulerDemandeDélai =
  ({ shouldUserAccessProject, demandeDélaiRepo, publishToEventStore }) =>
  ({ projectId, user, demandeDélaiId }) => {
    return wrapInfra(shouldUserAccessProject({ projectId, user })).andThen(
      (userHasRightsToProject) => {
        if (!userHasRightsToProject) {
          return errAsync(new UnauthorizedError())
        }

        return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), ({ statut }) => {
          if (statut === 'envoyée' || statut === 'en-instruction') {
            return publishToEventStore(
              new DélaiAnnulé({
                payload: { demandeDélaiId, annuléPar: user.id },
              })
            )
          }
          return errAsync(new StatusPreventsCancellingError(statut || 'inconnu'))
        })
      }
    )
  }
