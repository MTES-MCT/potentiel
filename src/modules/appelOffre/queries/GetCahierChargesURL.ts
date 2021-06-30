import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export type GetCahierChargesURL = (
  appelOffreId: string,
  periodeId: string
) => ResultAsync<string | undefined, InfraNotAvailableError>
