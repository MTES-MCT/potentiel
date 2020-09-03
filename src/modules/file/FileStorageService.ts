import { Readable } from 'stream'
import { ResultAsync } from '../../core/utils/Result'

export type FileContainer = {
  path: string
  stream: Readable
}

export interface FileStorageService {
  save: (file: FileContainer) => ResultAsync<string, Error>
  load: (fileId: string) => ResultAsync<FileContainer, Error>
  remove: (fileId: string) => ResultAsync<null, Error>
}
