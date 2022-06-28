import { User } from '@entities'
import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { DemandeDélai } from '../DemandeDélai'
import { errAsync, ResultAsync } from '@core/utils'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { DélaiAccordé } from './DélaiAccordé'
import { ImpossibleDAccorderDemandeDélai } from './ImpossibleDAccorderDemandeDélai'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'

type AccorderDemandeDélaiDeps = {
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  fileRepo: Repository<FileObject>
}

type AccorderDemandeDélaiCommande = {
  user: User
  demandeDélaiId: string
  dateAchèvementAccordée: Date
  fichierRéponse: { contents: FileContents; filename: string }
}

export const construireAccorderDemandeDélai =
  ({ demandeDélaiRepo, publishToEventStore, fileRepo }: AccorderDemandeDélaiDeps) =>
  ({
    user,
    demandeDélaiId,
    dateAchèvementAccordée,
    fichierRéponse,
  }: AccorderDemandeDélaiCommande): ResultAsync<
    null,
    InfraNotAvailableError | UnauthorizedError | ImpossibleDAccorderDemandeDélai
  > => {
    if (userIsNot(['admin', 'dreal', 'dgec'])(user)) {
      return errAsync(new UnauthorizedError())
    }

    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      return makeAndSaveFile({
        file: {
          designation: 'modification-request-response',
          forProject: demandeDélai.projet?.id,
          createdBy: new UniqueEntityID(user.id),
          filename: fichierRéponse.filename,
          contents: fichierRéponse.contents,
        },
        fileRepo,
      }).andThen((fichierRéponseId) =>
        demandeDélai.statut === 'envoyée'
          ? publishToEventStore(
              new DélaiAccordé({
                payload: {
                  accordéPar: user.id,
                  dateAchèvementAccordée,
                  demandeDélaiId,
                  fichierRéponseId,
                },
              })
            )
          : errAsync(new ImpossibleDAccorderDemandeDélai(demandeDélai))
      )
    })
  }
