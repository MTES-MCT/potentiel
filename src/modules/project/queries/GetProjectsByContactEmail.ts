import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '../../shared'

export type GetNonLegacyProjectsByContactEmail = (
  email: string
) => ResultAsync<string[], InfraNotAvailableError>
