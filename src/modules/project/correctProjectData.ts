import { okAsync, ResultAsync, errAsync } from '../../core/utils'
import { DomainError } from '../../core/domain'
import { ProjectRepo } from '../../dataAccess'
import { Project, User } from '../../entities'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'
import { EventStore } from '../eventStore'
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

interface CorrectProjectDataDeps {
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  eventStore: EventStore
}

interface CorrectProjectDataArgs {
  projectId: Project['id']
  certificateFile?: FileContainer
  projectVersionDate: Project['updatedAt']
  newNotifiedOn?: Project['notifiedOn']
  user: User
  correctedData: Partial<{
    numeroCRE: string
    appelOffreId: string
    periodeId: string
    familleId: string
    nomProjet: string
    territoire: string
    puissance: number
    prixReference: number
    evaluationCarbone: number
    note: number
    nomCandidat: string
    nomRepresentalLegal: string
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

export const makeCorrectProjectData = (
  deps: CorrectProjectDataDeps
): CorrectProjectData => ({
  projectId,
  certificateFile,
  projectVersionDate,
  newNotifiedOn,
  user,
  correctedData,
}: CorrectProjectDataArgs) => {
  let certificateFileId: string | undefined

  if (!user || !['admin', 'dgec'].includes(user.role)) {
    return errAsync(new UnauthorizedError())
  }

  return ResultAsync.fromPromise(
    deps.findProjectById(projectId),
    () => new InfraNotAvailableError()
  )
    .andThen((project) => {
      if (!project) {
        return errAsync(new EntityNotFoundError())
      }

      if (!project.notifiedOn) {
        return errAsync(new ProjectCannotBeUpdatedIfUnnotifiedError())
      }

      if (projectVersionDate != project.updatedAt) {
        return errAsync(new ProjectHasBeenUpdatedSinceError())
      }

      return okAsync(null)
    })
    .andThen(() => {
      if (!certificateFile) {
        return okAsync(null)
      }

      const fileResult = File.create({
        designation: 'garantie-financiere',
        forProject: projectId,
        createdBy: user.id,
        filename: certificateFile.path,
      })

      if (fileResult.isErr()) {
        console.log(
          'correctProjectData command: File.create failed',
          fileResult.error
        )

        return errAsync(new OtherError())
      }

      certificateFileId = fileResult.value.id.toString()

      return deps.fileService.save(fileResult.value, {
        ...certificateFile,
        path: makeProjectFilePath(projectId, certificateFile.path).filepath,
      })
    })
    .andThen(() =>
      deps.eventStore.publish(
        new ProjectDataCorrected({
          aggregateId: projectId,
          payload: {
            projectId,
            certificateFileId,
            correctedData,
          },
        })
      )
    )
    .andThen(() =>
      newNotifiedOn
        ? deps.eventStore.publish(
            new ProjectNotificationDateSet({
              aggregateId: projectId,
              payload: {
                projectId,
                notifiedOn: newNotifiedOn,
              },
            })
          )
        : okAsync(null)
    )
}
