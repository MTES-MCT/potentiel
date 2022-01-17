import { okAsync } from 'neverthrow'
import { EventBus, Repository, UniqueEntityID } from '../core/domain'
import { logger } from '../core/utils'
import { Project, User } from '../entities'
import { FileContents, FileObject, makeAndSaveFile } from '@modules/file'
import { GetProjectAppelOffreId, ModificationRequested } from '../modules/modificationRequest'
import { NumeroGestionnaireSubmitted } from '../modules/project/events'
import { ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  fileRepo: Repository<FileObject>
  eventBus: EventBus
  getProjectAppelOffreId: GetProjectAppelOffreId
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
}

interface RequestCommon {
  user: User
  file?: {
    contents: FileContents
    filename: string
  }
  projectId: Project['id']
}

interface DelayRequest {
  type: 'delai'
  justification: string
  delayInMonths: number
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

type CallUseCaseProps = RequestCommon & (DelayRequest | AbandonRequest | RecoursRequest)

export const ERREUR_FORMAT = 'Merci de remplir les champs marqués obligatoires'
export const ACCESS_DENIED_ERROR = "Vous n'avez pas le droit de faire de demandes pour ce projet"
export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeRequestModification({
  fileRepo,
  eventBus,
  shouldUserAccessProject,
  getProjectAppelOffreId,
}: MakeUseCaseProps) {
  return async function requestModification(props: CallUseCaseProps): ResultAsync<null> {
    const { user, projectId, file, type } = props

    // Check if the user has the rights to this project
    const access =
      user.role === 'porteur-projet' &&
      (await shouldUserAccessProject({
        user,
        projectId,
      }))

    if (!access) {
      return ErrorResult(ACCESS_DENIED_ERROR)
    }

    let fileId: string | undefined

    if (file) {
      const { filename, contents } = file

      const fileIdResult = await makeAndSaveFile({
        file: {
          designation: 'modification-request',
          forProject: new UniqueEntityID(projectId),
          createdBy: new UniqueEntityID(user.id),
          filename,
          contents,
        },
        fileRepo,
      })

      if (fileIdResult.isErr()) {
        logger.error(fileIdResult.error as Error)
        return ErrorResult(SYSTEM_ERROR)
      }

      fileId = fileIdResult.value.toString()
    }

    const { justification, puissance, delayInMonths, numeroGestionnaire } = props as any

    let appelOffreId: string = ''
    const appelOffreIdRes = await getProjectAppelOffreId(projectId)
    if (appelOffreIdRes.isOk()) {
      appelOffreId = appelOffreIdRes.value
    }

    const authority: 'dgec' | 'dreal' =
      type === 'delai' && appelOffreId !== 'Eolien' ? 'dreal' : 'dgec'

    const res = await eventBus
      .publish(
        new ModificationRequested({
          payload: {
            type,
            modificationRequestId: new UniqueEntityID().toString(),
            projectId,
            requestedBy: user.id,
            fileId,
            justification,
            puissance,
            delayInMonths,
            authority,
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

        return okAsync(null)
      })

    if (res.isErr()) {
      return ErrorResult(SYSTEM_ERROR)
    }

    // All is good
    return Ok(null)
  }
}
