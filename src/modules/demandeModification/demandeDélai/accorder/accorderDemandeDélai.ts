import { User } from '@entities'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { DélaiAccordé } from '../events/DélaiAccordé'
import { AccorderDemandeDélaiError } from './AccorderDemandeDélaiError'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'

type AccorderDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
  dateAchèvementAccordée: Date
  fichierRéponse: { contents: FileContents; filename: string }
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | AccorderDemandeDélaiError>

type MakeAccorderDemandeDélai = (dépendances: {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}) => AccorderDemandeDélai

export const construireAccorderDemandeDélai: MakeAccorderDemandeDélai =
  ({ demandeDélaiRepo, publishToEventStore, fileRepo }) =>
  ({ user, demandeDélaiId, dateAchèvementAccordée, fichierRéponse }) => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai

      if (statut !== 'envoyée' && statut !== 'en-instruction') {
        return errAsync(
          new AccorderDemandeDélaiError(
            demandeDélai,
            'Seul une demande envoyée ou en instruction peut être accordée'
          )
        )
      }

      if (!projetId) {
        return errAsync(new InfraNotAvailableError())
      }

      return makeAndSaveFile({
        file: {
          designation: 'modification-request-response',
          forProject: new UniqueEntityID(demandeDélai.projetId),
          createdBy: new UniqueEntityID(user.id),
          filename: fichierRéponse.filename,
          contents: fichierRéponse.contents,
        },
        fileRepo,
      }).andThen((fichierRéponseId) =>
        publishToEventStore(
          new DélaiAccordé({
            payload: {
              accordéPar: user.id,
              projetId,
              dateAchèvementAccordée,
              demandeDélaiId,
              fichierRéponseId,
            },
          })
        )
      )
    })
  }
