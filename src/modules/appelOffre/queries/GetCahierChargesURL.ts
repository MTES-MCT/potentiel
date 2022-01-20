import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '../../shared'

export type CahiersChargesURLs =
  | {
      oldCahierChargesURL?: string
      newCahierChargesURL?: string
    }
  | undefined

export type GetCahiersChargesURLs = (
  appelOffreId: string,
  periodeId: string
) => ResultAsync<CahiersChargesURLs, InfraNotAvailableError>
