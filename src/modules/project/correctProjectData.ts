import { okAsync, ResultAsync, errAsync } from '../../core/utils'
import { ProjectRepo } from '../../dataAccess'
import { Project, User } from '../../entities'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'
import { EventBus } from '../eventStore'
import { File, FileContainer, FileService } from '../file'
import {
  EntityNotFoundError,
  InfraNotAvailableError,
  OtherError,
  UnauthorizedError,
} from '../shared'
import { ProjectHasBeenUpdatedSinceError } from './errors/ProjectHasBeenUpdatedSinceError'
import { ProjectDataCorrected, ProjectNotificationDateSet } from './events'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { DomainError } from '../../core/domain'

interface CorrectProjectDataDeps {
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  eventBus: EventBus
}

interface CorrectProjectDataArgs {
  projectId: Project['id']
  certificateFile?: FileContainer
  projectVersionDate: Project['updatedAt']
  newNotifiedOn: Project['notifiedOn']
  user: User
  correctedData: Partial<{
    numeroCRE: string
    appelOffreId: string
    periodeId: string
    familleId: string
    nomProjet: string
    territoireProjet: string
    puissance: number
    prixReference: number
    evaluationCarbone: number
    note: number
    nomCandidat: string
    nomRepresentantLegal: string
    email: string
    adresseProjet: string
    codePostalProjet: string
    communeProjet: string
    engagementFournitureDePuissanceAlaPointe: boolean
    isFinancementParticipatif: boolean
    isInvestissementParticipatif: boolean
    isClasse: boolean
    motifsElimination: string
  }>
}

export type CorrectProjectData = (
  args: CorrectProjectDataArgs
) => ResultAsync<
  null,
  | InfraNotAvailableError
  | EntityNotFoundError
  | ProjectHasBeenUpdatedSinceError
  | UnauthorizedError
  | ProjectCannotBeUpdatedIfUnnotifiedError
>

export const makeCorrectProjectData = (deps: CorrectProjectDataDeps): CorrectProjectData => ({
  projectId,
  certificateFile,
  projectVersionDate,
  newNotifiedOn,
  user,
  correctedData,
}) => {
  let certificateFileId: string | undefined

  if (!user || !['admin', 'dgec'].includes(user.role)) {
    return errAsync(new UnauthorizedError())
  }

  return ResultAsync.fromPromise(
    deps.findProjectById(projectId),
    () => new InfraNotAvailableError()
  )
    .andThen(
      (
        project
      ): ResultAsync<
        Project,
        | EntityNotFoundError
        | ProjectCannotBeUpdatedIfUnnotifiedError
        | ProjectHasBeenUpdatedSinceError
      > => {
        if (!project) {
          return errAsync(new EntityNotFoundError())
        }

        if (!project.notifiedOn) {
          return errAsync(new ProjectCannotBeUpdatedIfUnnotifiedError())
        }

        console.log(
          'correctProjectData project.updatedAt',
          project.updatedAt?.getTime(),
          projectVersionDate?.getTime()
        )

        if (projectVersionDate?.getTime() !== project.updatedAt?.getTime()) {
          return errAsync(new ProjectHasBeenUpdatedSinceError())
        }

        return okAsync(project)
      }
    )
    .andThen(
      (
        project
      ): ResultAsync<
        { certificateFileId: string | undefined; project: Project },
        OtherError | DomainError
      > => {
        if (!certificateFile) {
          return okAsync({ project, certificateFileId: undefined })
        }

        const fileResult = File.create({
          designation: 'garantie-financiere',
          forProject: projectId,
          createdBy: user.id,
          filename: certificateFile.path,
        })

        if (fileResult.isErr()) {
          console.log('correctProjectData command: File.create failed', fileResult.error)

          return errAsync(new OtherError())
        }

        certificateFileId = fileResult.value.id.toString()

        return deps.fileService
          .save(fileResult.value, {
            ...certificateFile,
            path: makeProjectFilePath(projectId, certificateFile.path).filepath,
          })
          .map(() => ({ certificateFileId, project }))
      }
    )
    .andThen(
      ({
        certificateFileId,
        project,
      }): ResultAsync<{ project: Project }, InfraNotAvailableError> => {
        return deps.eventBus
          .publish(
            new ProjectDataCorrected({
              payload: {
                projectId,
                certificateFileId,
                correctedData,
                notifiedOn: newNotifiedOn,
              },
            })
          )
          .map(() => ({ project }))
      }
    )
    .andThen(
      ({ project }): ResultAsync<null, InfraNotAvailableError> => {
        return newNotifiedOn !== project.notifiedOn
          ? deps.eventBus.publish(
              new ProjectNotificationDateSet({
                payload: {
                  projectId,
                  notifiedOn: newNotifiedOn,
                },
              })
            )
          : okAsync(null)
      }
    )
}
