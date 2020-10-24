import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import { Readable } from 'stream'

import { Result, err, ok, ResultAsync } from '../../core/utils/Result'
import { FileStorageService, FileContainer } from '../../modules/file/FileStorageService'
import { pathExists } from '../../core/utils'

const buildDirectoryStructure = (filePath: string) =>
  ResultAsync.fromPromise(
    mkdirp(path.dirname(filePath)),
    (e: any) => new Error(e.message || 'Error in buildDirectoryStructure')
  )

const writeFileStream = (readStream: Readable, filePath: string) =>
  ResultAsync.fromPromise(
    new Promise((resolve, reject) => {
      const uploadWriteStream = fs.createWriteStream(filePath, {
        emitClose: true,
      })
      uploadWriteStream.on('error', reject)
      uploadWriteStream.on('close', resolve)
      readStream.pipe(uploadWriteStream)
    }),
    (e: any) => new Error(e.message || 'Error in the fs.createWriteStream phase')
  )

const deleteFile = util.promisify(fs.unlink)

class WrongIdentifierFormat extends Error {
  constructor() {
    super('Identifier is not recognized as localFile')
  }
}

export class LocalFileStorageService implements FileStorageService {
  constructor(private _rootPath: string) {}

  private static IDENTIFIER_PREFIX = 'localFile'

  private static makeIdentifier(file: FileContainer): string {
    return `${this.IDENTIFIER_PREFIX}:${file.path}`
  }

  private static parseIdentifier(fileId: string): Result<string, WrongIdentifierFormat> {
    if (fileId.indexOf(this.IDENTIFIER_PREFIX) !== 0) {
      return err(new WrongIdentifierFormat())
    }

    return ok(fileId.substring(this.IDENTIFIER_PREFIX.length + 1))
  }

  save(file: FileContainer): ResultAsync<string, Error> {
    const fullPath = path.resolve(this._rootPath, file.path)
    return buildDirectoryStructure(fullPath)
      .andThen(() => writeFileStream(file.stream as Readable, fullPath))
      .map(() => LocalFileStorageService.makeIdentifier(file))
  }

  load(fileId: string): ResultAsync<FileContainer, Error> {
    return LocalFileStorageService.parseIdentifier(fileId)
      .map((relativePath: string) => path.resolve(this._rootPath, relativePath))
      .asyncAndThen((fullPath: string) =>
        ResultAsync.fromPromise(
          pathExists(fullPath).then((exists) => {
            if (!exists) {
              throw new Error('File does not exist')
            }
            return {
              path: path.relative(this._rootPath, fullPath),
              stream: fs.createReadStream(fullPath),
            }
          }),
          (e: any) => new Error(e.message || 'Error in the fs.createReadStream phase')
        )
      )
  }

  remove(fileId: string): ResultAsync<null, Error> {
    return LocalFileStorageService.parseIdentifier(fileId)
      .map((relativePath: string) => path.resolve(this._rootPath, relativePath))
      .asyncAndThen((fullPath: string) =>
        ResultAsync.fromPromise(
          pathExists(fullPath).then((exists) => (exists ? deleteFile(fullPath) : null)),
          (e: any) => new Error(e.message || 'Error in the fs.unlink phase')
        )
      )
      .map(() => null)
  }
}
