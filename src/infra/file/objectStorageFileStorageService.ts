import { storage, ProviderOptions } from 'pkgcloud'
import Stream from 'stream'
import concat from 'concat-stream'
import { Result, err, ok, ResultAsync, okAsync } from '../../core/utils/Result'

import {
  FileStorageService,
  FileContainer,
} from '../../modules/file/FileStorageService'

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

export class ObjectStorageFileStorageService implements FileStorageService {
  private _client: storage.Client
  constructor(options: ProviderOptions, private _container: string) {
    this._client = storage.createClient(options)

    // this._client.getContainer(_container, (err, container) => {
    //   console.log('ObjectStorageFileStorageService found container', container)
    // })
  }
  private static IDENTIFIER_PREFIX = 'objectStorage'

  private makeIdentifier(file: FileContainer): string {
    return `${ObjectStorageFileStorageService.IDENTIFIER_PREFIX}:${this._container}:${file.path}`
  }

  private parseIdentifier(
    fileId: string
  ): Result<string, WrongIdentifierFormat> {
    if (
      fileId.indexOf(ObjectStorageFileStorageService.IDENTIFIER_PREFIX) !== 0
    ) {
      return err(new WrongIdentifierFormat())
    }

    const container = fileId.substring(
      ObjectStorageFileStorageService.IDENTIFIER_PREFIX.length + 1,
      fileId.lastIndexOf(':')
    )

    if (container !== this._container) {
      return err(new WrongContainer())
    }

    return ok(fileId.substring(fileId.lastIndexOf(':') + 1))
  }

  save(file: FileContainer): ResultAsync<string, Error> {
    // console.log('objectStorageFileStorageService call to save()')
    const res = ResultAsync.fromPromise(
      new Promise<storage.File>((resolve, reject) => {
        const uploadWriteStream = this._client.upload({
          container: this._container,
          remote: file.path,
        })
        uploadWriteStream.on('error', reject)
        uploadWriteStream.on('success', resolve)

        // This fixes a bug in pkgcloud (See https://github.com/pkgcloud/pkgcloud/pull/673)
        const concatStream = concat((buffer) => {
          const bufferStream = new Stream.PassThrough()
          bufferStream.end(buffer)
          bufferStream.pipe(uploadWriteStream)
        })

        file.stream.pipe(concatStream)
      }),
      (e: any) => {
        console.log('objectStorageFileStorageService.save caught error', e)
        return new Error(e.message || 'Error in the upload phase')
      }
    ).map(() => this.makeIdentifier(file))

    // console.log('objectStorageFileStorageService.save promise returned')

    return res
  }

  load(fileId: string): ResultAsync<FileContainer, Error> {
    return this.parseIdentifier(fileId)
      .map((remote: string) => ({
        path: remote,
        stream: this._client.download({
          container: this._container,
          remote: remote,
        }),
      }))
      .asyncAndThen((res) => okAsync(res))
  }

  remove(fileId: string): ResultAsync<null, Error> {
    return this.parseIdentifier(fileId).asyncAndThen((remote) =>
      ResultAsync.fromPromise(
        new Promise<null>((resolve, reject) => {
          this._client.removeFile(this._container, remote, (err) => {
            if (err) reject(err)
            else resolve(null)
          })
        }),
        (e: any) => new Error(e.message || 'Error in the remove phase')
      )
    )
  }
}
