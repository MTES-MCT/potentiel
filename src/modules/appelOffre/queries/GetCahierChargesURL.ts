import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'

export type GetCahiersChargesURLs = (
  appelOffreId: string,
  periodeId: string
) => ResultAsync<
  { oldCahierChargesURL?: string; newCahierChargesURL?: string } | undefined,
  InfraNotAvailableError
>
