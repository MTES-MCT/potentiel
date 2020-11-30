import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import { Readable } from 'stream'
import util from 'util'
import { pathExists } from '../../core/utils'
import { err, ok, Result, ResultAsync } from '../../core/utils/Result'
import { FileContents, FileNotFoundError, FileStorageService } from '../../modules/file'
import { InfraNotAvailableError } from '../../modules/shared'

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

const IDENTIFIER_PREFIX = 'localFile'
function makeIdentifier(path: string): string {
  return `${IDENTIFIER_PREFIX}:${path}`
}

function parseIdentifier(fileId: string): Result<string, WrongIdentifierFormat> {
  if (fileId.indexOf(IDENTIFIER_PREFIX) !== 0) {
    return err(new WrongIdentifierFormat())
  }

  return ok(fileId.substring(IDENTIFIER_PREFIX.length + 1))
}

function assertFileExists(fileExists: boolean): Result<null, FileNotFoundError> {
  if (!fileExists) {
    return err(new FileNotFoundError())
  }

  return ok(null)
}

export const makeLocalFileStorageService = (_rootPath: string): FileStorageService => {
  return {
    upload({ contents, path: filePath }) {
      const fullPath = path.resolve(_rootPath, filePath)
      return buildDirectoryStructure(fullPath)
        .andThen(() => writeFileStream(contents, fullPath))
        .map(() => makeIdentifier(filePath))
    },

    download(storedAt) {
      return parseIdentifier(storedAt)
        .map((relativePath: string) => path.resolve(_rootPath, relativePath))
        .asyncAndThen((fullPath: string) =>
          ResultAsync.fromPromise(pathExists(fullPath), (e: any) => {
            console.error(e)
            return new InfraNotAvailableError()
          }).map((fileExists) => ({ fileExists, fullPath }))
        )
        .andThen(({ fileExists, fullPath }) => assertFileExists(fileExists).map(() => fullPath))
        .map((fullPath) => fs.createReadStream(fullPath) as FileContents)
    },

    remove(storedAt) {
      return parseIdentifier(storedAt)
        .map((relativePath: string) => path.resolve(_rootPath, relativePath))
        .asyncAndThen((fullPath: string) =>
          ResultAsync.fromPromise(pathExists(fullPath), (e: any) => {
            console.error(e)
            return new InfraNotAvailableError()
          }).map((fileExists) => ({ fileExists, fullPath }))
        )
        .andThen(({ fileExists, fullPath }) => assertFileExists(fileExists).map(() => fullPath))
        .andThen((fullPath) =>
          ResultAsync.fromPromise(deleteFile(fullPath), (e: any) => {
            console.error(e)
            return new InfraNotAvailableError()
          })
        )
        .map(() => null)
    },
  }
}
