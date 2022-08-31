import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { DemandeAbandon } from '../DemandeAbandon'
import { StatutRéponseIncompatibleAvecAnnulationError } from '../../errors'
import { RejetAbandonAnnulé } from '../events'

type AnnulerRejetAbandon = (commande: {
  user: User
  demandeAbandonId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerRejetAbandon = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeAbandonRepo: TransactionalRepository<DemandeAbandon>
  publishToEventStore: EventStore['publish']
}) => AnnulerRejetAbandon

export const makeAnnulerRejetAbandon: MakeAnnulerRejetAbandon =
  ({ shouldUserAccessProject, demandeAbandonRepo, publishToEventStore }) =>
  ({ user, demandeAbandonId }) => {
    if (!['admin', 'dgec-validateur'].includes(user.role)) {
      return errAsync(new UnauthorizedError())
    }
    return demandeAbandonRepo.transaction(
      new UniqueEntityID(demandeAbandonId),
      (demandeAbandon) => {
        const { statut, projetId } = demandeAbandon
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
                new RejetAbandonAnnulé({
                  payload: { demandeAbandonId, projetId, annuléPar: user.id },
                })
              )
            }
            return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(statut || 'inconnu'))
          }
        )
      }
    )
  }
