import { EventBus, Repository, UniqueEntityID } from '@core/domain'
import { ok, wrapInfra, err, errAsync } from '@core/utils'
import { User, formatCahierDesChargesRéférence } from '@entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { ModificationRequested } from '@modules/modificationRequest'
import { NumeroGestionnaireSubmitted, Project } from '@modules/project'
import { userIsNot } from '@modules/users'
import { UnauthorizedError } from '@modules/shared'

interface MakeUseCaseProps {
  fileRepo: Repository<FileObject>
  eventBus: EventBus
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
}

interface RequestCommon {
  user: User
  file?: {
    contents: FileContents
    filename: string
  }
  projectId: string
  numeroGestionnaire?: string
}

interface AbandonRequest {
  type: 'abandon'
  justification: string
}

interface RecoursRequest {
  type: 'recours'
  justification: string
}

type CallUseCaseProps = RequestCommon & (AbandonRequest | RecoursRequest)

export default function makeRequestModification({
  fileRepo,
  eventBus,
  shouldUserAccessProject,
  projectRepo,
}: MakeUseCaseProps) {
  return ({ user, projectId, file, type, justification, numeroGestionnaire }: CallUseCaseProps) => {
    if (userIsNot('porteur-projet')(user)) return errAsync(new UnauthorizedError())

    return wrapInfra(
      shouldUserAccessProject({
        user,
        projectId,
      })
    )
      .andThen((access) => {
        if (!access) {
          return err(new UnauthorizedError())
        }

        if (!file) return ok(null)

        const { filename, contents } = file
        return makeAndSaveFile({
          file: {
            designation: 'modification-request',
            forProject: new UniqueEntityID(projectId),
            createdBy: new UniqueEntityID(user.id),
            filename,
            contents,
          },
          fileRepo,
        })
      })
      .andThen((fileId) =>
        projectRepo.load(new UniqueEntityID(projectId)).andThen((project) =>
          eventBus
            .publish(
              new ModificationRequested({
                payload: {
                  type,
                  modificationRequestId: new UniqueEntityID().toString(),
                  projectId,
                  requestedBy: user.id,
                  ...(fileId ? { fileId } : {}),
                  justification,
                  authority: 'dgec',
                  cahierDesCharges: formatCahierDesChargesRéférence(project.cahierDesCharges),
                },
              })
            )
            .andThen(() => {
              if (numeroGestionnaire) {
                return eventBus.publish(
                  new NumeroGestionnaireSubmitted({
                    payload: { projectId, submittedBy: user.id, numeroGestionnaire },
                  })
                )
              }
              return ok(null)
            })
        )
      )
  }
}
