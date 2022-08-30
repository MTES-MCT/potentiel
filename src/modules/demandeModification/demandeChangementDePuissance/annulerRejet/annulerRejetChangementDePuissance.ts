import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra, okAsync } from '@core/utils'
import { User } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { ModificationRequest } from '@modules/modificationRequest'
// import { RejetRecoursAnnulé } from '../events'

type AnnulerRejetChangementDePuissance = (commande: {
  user: User
  demandeChangementDePuissanceId: string
}) => ResultAsync<
  null,
  // InfraNotAvailableError |
  UnauthorizedError
  // EntityNotFoundError
>

type MakeAnnulerRejetChangementDePuissance = (dépendances: {
  modificationRequestRepo: TransactionalRepository<ModificationRequest>
  publishToEventStore: EventStore['publish']
}) => AnnulerRejetChangementDePuissance

export const makeAnnulerRejetChangementDePuissance: MakeAnnulerRejetChangementDePuissance =
  ({ publishToEventStore, modificationRequestRepo }) =>
  ({ user, demandeChangementDePuissanceId }) => {
    if (!['admin', 'dgec-validateur', 'dreal'].includes(user.role)) {
      return errAsync(new UnauthorizedError())
    }

    return okAsync(null)
    // return modificationRequestRepo.transaction(
    //   new UniqueEntityID(demandeChangementDePuissanceId),
    //   (demandeDélai) => {
    //     const { status, projectId } = demandeDélai
    //     if (!projectId) {
    //       return errAsync(new InfraNotAvailableError())
    //     }

    //     if (status !== 'rejetée') {
    //       return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(status || 'inconnu'))
    //     }

    //     return publishToEventStore(
    //       new RejetRecoursAnnulé({
    //         payload: {
    //           demandeChangementDePuissanceId,
    //           projetId: projectId.toString(),
    //           annuléPar: user.id,
    //         },
    //       })
    //     )
    //   }
    // )
  }
