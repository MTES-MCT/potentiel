import { EventStore, Repository, TransactionalRepository } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'

import { DemandeDélai } from '../DemandeDélai'

type RefuserDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
  fichierRéponse: { contents: FileContents; filename: string }
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>

type MakeRefuserDemandeDélai = (dépendances: {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}) => RefuserDemandeDélai

export const makeRefuserDemandeDélai: MakeRefuserDemandeDélai =
  () =>
  ({ user }) => {
    if (userIsNot(['admin', 'dgec', 'dreal'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return okAsync(null)
  }
