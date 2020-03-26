import { ModificationRequest, makeModificationRequest } from '../entities'
import { ModificationRequestRepo } from '../dataAccess'
import _ from 'lodash'
import { Result, Err, Ok, ResultAsync, ErrorResult } from '../types'
import { User } from '../entities'

interface MakeUseCaseProps {
  modificationRequestRepo: ModificationRequestRepo
}

interface RequestCommon {
  requestedBy: User['id']
  filePath?: string
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
      return Err(modificationRequestResult.unwrap_err())
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
