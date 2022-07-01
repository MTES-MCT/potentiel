import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'

import { DemandeDélai } from '../DemandeDélai'
import { DélaiRejeté } from '../events/DélaiRejeté'
import { RejeterDemandeDélaiError } from './RejeterDemandeDélaiError'

type RejeterDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
  fichierRéponse: { contents: FileContents; filename: string }
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>

type MakeRejeterDemandeDélai = (dépendances: {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}) => RejeterDemandeDélai

export const makeRejeterDemandeDélai: MakeRejeterDemandeDélai =
  ({ publishToEventStore, demandeDélaiRepo, fileRepo }) =>
  ({ user, demandeDélaiId, fichierRéponse: { filename, contents } }) => {
    if (userIsNot(['admin', 'dgec', 'dreal'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai

      if (statut !== 'envoyée' && statut !== 'en-instruction') {
        return errAsync(
          new RejeterDemandeDélaiError(
            demandeDélai,
            'Seul une demande envoyée ou en instruction peut être rejetée.'
          )
        )
      }

      if (!projetId) {
        return errAsync(new InfraNotAvailableError())
      }

      return makeAndSaveFile({
        file: {
          designation: 'modification-request-response',
          forProject: new UniqueEntityID(projetId),
          createdBy: new UniqueEntityID(user.id),
          filename,
          contents,
        },
        fileRepo,
      }).andThen((fichierRéponseId) => {
        return publishToEventStore(
          new DélaiRejeté({
            payload: {
              demandeDélaiId,
              rejetéPar: user.id,
              fichierRéponseId,
              projetId,
            },
          })
        )
      })
    })
  }
