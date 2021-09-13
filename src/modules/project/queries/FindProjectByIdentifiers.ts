import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'

export type FindProjectByIdentifiers = (args: {
  appelOffreId: string
  periodeId: string
  familleId?: string
  numeroCRE: string
}) => ResultAsync<string | null, InfraNotAvailableError>
