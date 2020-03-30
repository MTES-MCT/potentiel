import { ModificationRequest, makeModificationRequest } from '../entities'
import { ModificationRequestRepo } from '../dataAccess'
import _ from 'lodash'
import { Result, Err, Ok, ResultAsync, ErrorResult } from '../types'
import { User, Project } from '../entities'

interface MakeUseCaseProps {
  modificationRequestRepo: ModificationRequestRepo
}

interface RequestCommon {
  userId: User['id']
  filePath?: string
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

type CallUseCaseProps = RequestCommon &
  (
    | ActionnaireRequest
    | ProducteurRequest
    | FournisseurRequest
    | PuissanceRequest
    | DelayRequest
    | AbandonRequest
  )

export const ERREUR_FORMAT = 'Merci de remplir les champs marqués obligatoires'

export default function makeRequestModification({
  modificationRequestRepo
}: MakeUseCaseProps) {
  return async function requestModification(
    props: CallUseCaseProps
  ): ResultAsync<null> {
    const modificationRequestResult = makeModificationRequest(props)

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
