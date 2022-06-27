import { User } from '@entities'
import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { DélaiAccordé } from './DélaiAccordé'
import { ImpossibleDAccorderDemandeDélai } from './ImpossibleDAccorderDemandeDélai'

type AccorderDemandeDélaiDeps = {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
}

type AccorderDemandeDélaiCommande = {
  user: User
  demandeDélaiId: string
  dateAchèvementAccordée: Date
}

export const construireAccorderDemandeDélai =
  ({ demandeDélaiRepo, publishToEventStore }: AccorderDemandeDélaiDeps) =>
  ({
    user,
    demandeDélaiId,
    dateAchèvementAccordée,
  }: AccorderDemandeDélaiCommande): ResultAsync<
    null,
    InfraNotAvailableError | UnauthorizedError | ImpossibleDAccorderDemandeDélai
  > => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) =>
      demandeDélai.statut === 'envoyée'
        ? publishToEventStore(
            new DélaiAccordé({
              payload: {
                accordéPar: user.id,
                dateAchèvementAccordée,
                demandeDélaiId,
              },
            })
          )
        : errAsync(new ImpossibleDAccorderDemandeDélai(demandeDélai))
    )
  }
