import { storage, ProviderOptions } from 'pkgcloud'
import Stream from 'stream'
import concat from 'concat-stream'
import { Result, err, ok, ResultAsync, okAsync, errAsync } from '../../core/utils/Result'

import { FileStorageService, FileContents } from '../../modules/file'
import { InfraNotAvailableError } from '../../modules/shared'

class WrongIdentifierFormat extends Error {
  constructor() {
    super('Identifier is not recognized as objectStorage.')
  }
}

class WrongContainer extends Error {
  constructor() {
    super('The object storage container does not match the current container.')
  }
}

const IDENTIFIER_PREFIX = 'objectStorage'

function makeIdentifier(filePath: string, container: string): string {
  return `${IDENTIFIER_PREFIX}:${container}:${filePath}`
}

function parseIdentifier(
  fileId: string,
  _container: string
): Result<string, WrongIdentifierFormat> {
  if (fileId.indexOf(IDENTIFIER_PREFIX) !== 0) {
    return err(new WrongIdentifierFormat())
  }

  const container = fileId.substring(IDENTIFIER_PREFIX.length + 1, fileId.lastIndexOf(':'))

  if (container !== _container) {
    return err(new WrongContainer())
  }

  return ok(fileId.substring(fileId.lastIndexOf(':') + 1))
}

export const makeObjectStorageFileStorageService = (
  options: ProviderOptions,
  _container: string
): FileStorageService => {
  const _client = storage.createClient(options)

  return {
    upload({ contents, path: filePath }) {
      return ResultAsync.fromPromise(
        new Promise<storage.File>((resolve, reject) => {
          const uploadWriteStream = _client.upload({
            container: _container,
            remote: filePath,
          })
          uploadWriteStream.on('error', reject)
          uploadWriteStream.on('success', resolve)

          // This fixes a bug in pkgcloud (See https://github.com/pkgcloud/pkgcloud/pull/673)
          const concatStream = concat((buffer) => {
            const bufferStream = new Stream.PassThrough()
            if (Array.isArray(buffer)) {
              console.log(
                'WARNING: objectStorageFileStorageService received buffer as array chunk, ignoring chunk'
              )
              bufferStream.end('')
            } else {
              bufferStream.end(buffer)
            }
            bufferStream.pipe(uploadWriteStream)
          })

          contents.pipe(concatStream)
        }),
        (e: any) => {
          console.error('ObjectStorageFileStorageService.remove', e)
          return new InfraNotAvailableError()
        }
      ).map(() => makeIdentifier(filePath, _container))
    },

    download(storedAt) {
      return parseIdentifier(storedAt, _container)
        .map((remote: string) =>
          _client.download({
            container: _container,
            remote: remote,
          })
        )
        .asyncAndThen((res) => okAsync(res))
    },

    remove(storedAt) {
      return parseIdentifier(storedAt, _container).asyncAndThen((remote) =>
        ResultAsync.fromPromise(
          new Promise<null>((resolve, reject) => {
            _client.removeFile(_container, remote, (err) => {
              if (err) reject(err)
              else resolve(null)
            })
          }),
          (e: any) => {
            console.error('ObjectStorageFileStorageService.remove', e)
            return new InfraNotAvailableError()
          }
        )
      )
    },
  }
}
