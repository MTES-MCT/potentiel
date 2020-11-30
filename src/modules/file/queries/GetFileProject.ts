import { UniqueEntityID } from '../../../core/domain'
import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { FileNotFoundError } from '../errors'

export interface GetFileProject {
  (fileId: UniqueEntityID): ResultAsync<
    UniqueEntityID | null,
    InfraNotAvailableError | FileNotFoundError
  >
}
