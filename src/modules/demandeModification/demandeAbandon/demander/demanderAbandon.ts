import { errAsync, okAsync } from 'neverthrow'
import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { wrapInfra, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { Project } from '@modules/project'
import { AbandonDemandé } from '../events/AbandonDemandé'
import { FileObject } from '../../../file'
import { AppelOffreRepo } from '@dataAccess'
import { GetProjectAppelOffreId } from '../../../modificationRequest'

type DemanderAbandon = (commande: {
  user: User
  projectId: string
  justification?: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError>

type MakeDemanderAbandon = (dépendances: {
  publishToEventStore: EventStore['publish']
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
  fileRepo: Repository<FileObject>
  findAppelOffreById: AppelOffreRepo['findById']
  getProjectAppelOffreId: GetProjectAppelOffreId
}) => DemanderAbandon

export const makeDemanderAbandon: MakeDemanderAbandon =
  ({
    publishToEventStore,
    shouldUserAccessProject,
    projectRepo,
    fileRepo,
    findAppelOffreById,
    getProjectAppelOffreId,
  }) =>
  ({ user, projectId, justification }) => {
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
        publishToEventStore(
          new AbandonDemandé({
            payload: {
              demandeAbandonId: new UniqueEntityID().toString(),
              projetId: projectId,
              // ...(fileId && { fichierId: fileId }),
              justification,
              autorité: appelOffre?.type === 'eolien' ? 'dgec' : 'dreal',
              porteurId: user.id,
            },
          })
        )

        return okAsync(null)
      })
  }
