import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '../shared'
import { FileAccessDeniedError, FileNotFoundError } from './errors'
import { FileContents } from './FileObject'

export interface FileStorageService {
  upload: ({
    contents: FileContents,
    path: string,
  }) => ResultAsync<string, FileAccessDeniedError | InfraNotAvailableError>
  download: (
    storedAt: string
  ) => ResultAsync<FileContents, FileNotFoundError | FileAccessDeniedError | InfraNotAvailableError>
  remove: (
    storedAt: string
  ) => ResultAsync<null, FileNotFoundError | FileAccessDeniedError | InfraNotAvailableError>
}
