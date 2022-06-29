import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'

import { DemandeDélai } from '../DemandeDélai'
import { DélaiRefusé } from '../events/DélaiRefusé'
import { RefuserDemandeDélaiError } from './RefuserDemandeDélaiError'

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
  ({ publishToEventStore, demandeDélaiRepo, fileRepo }) =>
  ({ user, demandeDélaiId, fichierRéponse: { filename, contents } }) => {
    if (userIsNot(['admin', 'dgec', 'dreal'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut } = demandeDélai

      if (statut !== 'envoyée' && statut !== 'en-instruction') {
        return errAsync(
          new RefuserDemandeDélaiError(
            demandeDélai,
            'Seul une demande envoyée ou en instruction peut être refusée'
          )
        )
      }

      return makeAndSaveFile({
        file: {
          designation: 'modification-request-response',
          forProject: demandeDélai.projet?.id,
          createdBy: new UniqueEntityID(user.id),
          filename,
          contents,
        },
        fileRepo,
      }).andThen((fichierRéponseId) => {
        return publishToEventStore(
          new DélaiRefusé({
            payload: {
              demandeDélaiId,
              refuséPar: user.id,
              fichierRéponseId,
            },
          })
        )
      })
    })
  }
