import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
import { RejetRecoursAnnulé } from '../events'

type AnnulerRejetRecours = (commande: {
  user: User
  demandeRecoursId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerRejetRecours = (dépendances: {
  modificationRequestRepo: TransactionalRepository<ModificationRequest>
  publishToEventStore: EventStore['publish']
}) => AnnulerRejetRecours

export const makeAnnulerRejetRecours: MakeAnnulerRejetRecours =
  ({ publishToEventStore, modificationRequestRepo }) =>
  ({ user, demandeRecoursId }) => {
    if (!['admin', 'dgec-validateur'].includes(user.role)) {
      return errAsync(new UnauthorizedError())
    }
    return modificationRequestRepo.transaction(
      new UniqueEntityID(demandeRecoursId),
      (demandeDélai) => {
        const { status, projectId } = demandeDélai
        if (!projectId) {
          return errAsync(new InfraNotAvailableError())
        }

        if (status !== 'rejetée') {
          return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(status || 'inconnu'))
        }

        return publishToEventStore(
          new RejetRecoursAnnulé({
            payload: {
              demandeRecoursId,
              projetId: projectId.toString(),
              annuléPar: user.id,
            },
          })
        )
      }
    )
  }
