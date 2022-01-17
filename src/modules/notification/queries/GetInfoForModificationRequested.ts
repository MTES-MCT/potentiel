import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

interface ModificationRequestedInfo {
  nomProjet: string
  porteurProjet: {
    fullName: string
    email: string
  }
}

export type GetInfoForModificationRequested = (args: {
  projectId: string
  userId: string
}) => ResultAsync<ModificationRequestedInfo, EntityNotFoundError | InfraNotAvailableError>
