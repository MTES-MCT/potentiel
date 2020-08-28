import { Readable } from 'stream'
import { ResultAsync } from './Result'

export type File = {
  path: string
  stream: Readable
}

export abstract class FileIdentifier {
  abstract toString(): string
}

export interface FileService {
  save: (file: File) => ResultAsync<FileIdentifier, Error>
  load: (fileId: FileIdentifier) => ResultAsync<File, Error>
  remove: (fileId: FileIdentifier) => ResultAsync<null, Error>
}
