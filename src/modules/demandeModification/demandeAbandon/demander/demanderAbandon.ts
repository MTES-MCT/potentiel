import { errAsync, okAsync } from 'neverthrow'
import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { wrapInfra, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { AbandonDemandé } from '../events'
import { FileContents, FileObject, makeFileObject } from '../../../file'
import { AppelOffreRepo } from '@dataAccess'
import { GetProjectAppelOffreId } from '../../../modificationRequest'

type DemanderAbandon = (commande: {
  user: User
  projectId: string
  justification?: string
  file?: {
    contents: FileContents
    filename: string
  }
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>

type MakeDemanderAbandon = (dépendances: {
  publishToEventStore: EventStore['publish']
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  fileRepo: Repository<FileObject>
  findAppelOffreById: AppelOffreRepo['findById']
  getProjectAppelOffreId: GetProjectAppelOffreId
}) => DemanderAbandon

export const makeDemanderAbandon: MakeDemanderAbandon =
  ({
    publishToEventStore,
    shouldUserAccessProject,
    fileRepo,
    findAppelOffreById,
    getProjectAppelOffreId,
  }) =>
  ({ user, projectId, justification, file }) => {
    return wrapInfra(
      shouldUserAccessProject({
        user,
        projectId,
      })
    )
      .andThen((userHasRightsToProject) => {
        if (!userHasRightsToProject) {
          return errAsync(new UnauthorizedError())
        }
        return getProjectAppelOffreId(projectId).andThen((appelOffreId) => {
          return wrapInfra(findAppelOffreById(appelOffreId))
        })
      })
      .andThen((appelOffre) => {
        if (!file) return okAsync({ appelOffre, fileId: null })

        return makeFileObject({
          designation: 'modification-request',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(user.id),
          filename: file.filename,
          contents: file.contents,
        }).asyncAndThen((file) =>
          fileRepo.save(file).map(() => ({ appelOffre, fileId: file.id.toString() }))
        )
      })
      .andThen(({ appelOffre, fileId }) =>
        publishToEventStore(
          new AbandonDemandé({
            payload: {
              demandeAbandonId: new UniqueEntityID().toString(),
              projetId: projectId,
              ...(fileId && { fichierId: fileId }),
              justification,
              autorité: appelOffre?.type === 'eolien' ? 'dgec' : 'dreal',
              porteurId: user.id,
            },
          })
        )
      )
  }
