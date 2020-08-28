import { storage, ProviderOptions } from 'pkgcloud'

import { Result, err, ok, ResultAsync, okAsync } from '../core/utils/Result'

import { FileService, File, FileIdentifier } from '../core/utils/FileService'

export class ObjectStorageIdentifier extends FileIdentifier {
  constructor(private _container: string, private _remote: string) {
    super()
  }

  get container(): string {
    return this._container
  }

  get remote(): string {
    return this._remote
  }

  static fromString(
    stringifiedIdentifier: string
  ): Result<ObjectStorageIdentifier, Error> {
    try {
      const props = JSON.parse(stringifiedIdentifier)

      if (props.provider === 'openstack') {
        return ok(new ObjectStorageIdentifier(props.container, props.remote))
      } else
        return err(new Error('ObjectStorageIdentifier with wrong provider'))
    } catch (e) {
      return err(
        new Error('Cannot parse ObjectStorageIdentifier from provided string')
      )
    }
  }

  toString() {
    return JSON.stringify({
      provider: 'openstack',
      container: this._container,
      remote: this._remote,
    })
  }
}

export class ObjectStorageFileService implements FileService {
  private _client: storage.Client
  constructor(options: ProviderOptions, private _container: string) {
    this._client = storage.createClient(options)
  }

  save(file: File): ResultAsync<ObjectStorageIdentifier, Error> {
    return ResultAsync.fromPromise(
      new Promise<storage.File>((resolve, reject) => {
        const uploadWriteStream = this._client.upload({
          container: this._container,
          remote: file.path,
        })
        uploadWriteStream.on('error', reject)
        uploadWriteStream.on('success', resolve)
        file.stream.pipe(uploadWriteStream)
      }),
      (e: any) => new Error(e.message || 'Error in the upload phase')
    ).map(
      (file: storage.File) =>
        new ObjectStorageIdentifier(file.container, file.name)
    )
  }

  load(fileId: ObjectStorageIdentifier): ResultAsync<File, Error> {
    const downloadStream = this._client.download({
      container: fileId.container,
      remote: fileId.remote,
    })
    return okAsync({
      path: fileId.remote,
      stream: downloadStream,
    })
  }

  remove(fileId: ObjectStorageIdentifier): ResultAsync<null, Error> {
    return ResultAsync.fromPromise(
      new Promise<null>((resolve, reject) => {
        this._client.removeFile(this._container, fileId.remote, (err) => {
          if (err) reject(err)
          else resolve(null)
        })
      }),
      (e: any) => new Error(e.message || 'Error in the remove phase')
    )
  }
}
