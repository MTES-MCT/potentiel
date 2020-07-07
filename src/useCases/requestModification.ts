import { ModificationRequest, makeModificationRequest } from '../entities'
import { ModificationRequestRepo } from '../dataAccess'
import _ from 'lodash'
import { Result, Err, Ok, ResultAsync, ErrorResult } from '../types'
import { User, Project } from '../entities'

interface MakeUseCaseProps {
  modificationRequestRepo: ModificationRequestRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
}

interface RequestCommon {
  user: User
  filename?: string
  projectId: Project['id']
}

interface ActionnaireRequest {
  type: 'actionnaire'
  actionnaire: string
}

interface ProducteurRequest {
  type: 'producteur'
  producteur: string
}

interface FournisseurRequest {
  type: 'fournisseur'
  fournisseur: string
  evaluationCarbone: number
}

interface PuissanceRequest {
  type: 'puissance'
  puissance: number
}

interface DelayRequest {
  type: 'delai'
  justification: string
}

interface AbandonRequest {
  type: 'abandon'
  justification: string
}

interface RecoursRequest {
  type: 'recours'
  justification: string
}

type CallUseCaseProps = RequestCommon &
  (
    | ActionnaireRequest
    | ProducteurRequest
    | FournisseurRequest
    | PuissanceRequest
    | DelayRequest
    | AbandonRequest
    | RecoursRequest
  )

export const ERREUR_FORMAT = 'Merci de remplir les champs marqués obligatoires'
export const ACCESS_DENIED_ERROR =
  "Vous n'avez pas le droit de faire de demandes pour ce projet"

export default function makeRequestModification({
  modificationRequestRepo,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function requestModification(
    props: CallUseCaseProps
  ): ResultAsync<null> {
    const { user, projectId } = props

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

    // console.log('modificationRequest usecase', props)
    const modificationRequestResult = makeModificationRequest({
      ...props,
      userId: user.id,
    })

    if (modificationRequestResult.is_err()) {
      console.log(
        'requestModification use-case could not create modificationRequest',
        props,
        modificationRequestResult.unwrap_err()
      )
      return ErrorResult(ERREUR_FORMAT)
    }

    const modificationRequest = modificationRequestResult.unwrap()
    const insertionResult = await modificationRequestRepo.insert(
      modificationRequest
    )

    if (insertionResult.is_err()) {
      console.log(
        'requestModification use-case could not insert modificationRequest',
        modificationRequest,
        insertionResult.unwrap_err()
      )
      return Err(insertionResult.unwrap_err())
    }

    // All is good

    return Ok(null)
  }
}
