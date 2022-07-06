import { errAsync, okAsync } from 'neverthrow'
import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { logger, wrapInfra, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { FileContents, FileObject, makeFileObject } from '@modules/file'
import { DélaiDemandé } from '@modules/demandeModification'
import { GetProjectAppelOffreId } from '@modules/modificationRequest'
import { AppelOffreRepo } from '@dataAccess'
import {
  InfraNotAvailableError,
  UnauthorizedError,
  DateAchèvementAntérieureDateThéoriqueError,
} from '@modules/shared'
import { NumeroGestionnaireSubmitted, Project, ProjectNewRulesOptedIn } from '@modules/project'

type DemanderDélai = (commande: {
  user: User
  file?: {
    contents: FileContents
    filename: string
  }
  projectId: string
  justification?: string
  dateAchèvementDemandée: Date
  numeroGestionnaire?: string
}) => ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError | DateAchèvementAntérieureDateThéoriqueError
>

type MakeDemanderDélai = (dépendances: {
  fileRepo: Repository<FileObject>
  appelOffreRepo: AppelOffreRepo
  publishToEventStore: EventStore['publish']
  getProjectAppelOffreId: GetProjectAppelOffreId
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
}) => DemanderDélai

export const makeDemanderDélai: MakeDemanderDélai =
  ({
    fileRepo,
    appelOffreRepo,
    publishToEventStore,
    shouldUserAccessProject,
    getProjectAppelOffreId,
    projectRepo,
  }) =>
  ({ user, projectId, file, justification, dateAchèvementDemandée, numeroGestionnaire }) => {
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
        return projectRepo.load(new UniqueEntityID(projectId)).andThen((project) => {
          if (dateAchèvementDemandée.getTime() <= project.completionDueOn) {
            return errAsync(new DateAchèvementAntérieureDateThéoriqueError())
          }

          if (project.newRulesOptIn === false) {
            return publishToEventStore(
              new ProjectNewRulesOptedIn({ payload: { projectId, optedInBy: user.id } })
            )
          }

          return okAsync(null)
        })
      })
      .andThen(() => {
        if (!file) return okAsync(null)

        return makeFileObject({
          designation: 'modification-request',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(user.id),
          filename: file.filename,
          contents: file.contents,
        })
          .asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))
          .mapErr((e: Error) => {
            logger.error(e)
            return new InfraNotAvailableError()
          })
      })
      .andThen((fileId) =>
        getProjectAppelOffreId(projectId).andThen((appelOffreId) => {
          return wrapInfra(appelOffreRepo.findById(appelOffreId)).map((appelOffre) => ({
            appelOffre,
            fileId,
          }))
        })
      )
      .andThen(({ appelOffre, fileId }) => {
        return publishToEventStore(
          new DélaiDemandé({
            payload: {
              demandeDélaiId: new UniqueEntityID().toString(),
              projetId: projectId,
              ...(fileId && { fichierId: fileId }),
              justification,
              dateAchèvementDemandée: dateAchèvementDemandée.toISOString(),
              autorité: appelOffre?.type === 'eolien' ? 'dgec' : 'dreal',
              porteurId: user.id,
            },
          })
        ).andThen(() => {
          if (numeroGestionnaire) {
            return publishToEventStore(
              new NumeroGestionnaireSubmitted({
                payload: { projectId, submittedBy: user.id, numeroGestionnaire },
              })
            )
          }
          return okAsync(null)
        })
      })
  }
