import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import { Readable } from 'stream'

import { Result, err, ok, ResultAsync, okAsync } from '../core/utils/Result'
import { FileService, File, FileIdentifier } from '../core/utils/FileService'

export class LocalFileIdentifier extends FileIdentifier {
  constructor(private _filePath: string) {
    super()
  }

  get filePath(): string {
    return this._filePath
  }

  static fromString(
    stringifiedIdentifier: string
  ): Result<LocalFileIdentifier, Error> {
    try {
      const props = JSON.parse(stringifiedIdentifier)

      if (props.provider === 'filesystem') {
        return ok(new LocalFileIdentifier(props.filePath))
      } else return err(new Error('LocalIdentifier with wrong provider'))
    } catch (e) {
      return err(new Error('Cannot parse LocalIdentifier from provided string'))
    }
  }

  toString() {
    return JSON.stringify({
      provider: 'filesystem',
      filePath: this._filePath,
    })
  }
}

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
    (e: any) =>
      new Error(e.message || 'Error in the fs.createWriteStream phase')
  )

const fileExists = util.promisify(fs.exists)
const deleteFile = util.promisify(fs.unlink)

export class LocalFileService implements FileService {
  constructor(private _rootPath: string) {}

  save(file: File): ResultAsync<LocalFileIdentifier, Error> {
    const fullPath = path.resolve(this._rootPath, file.path)
    return buildDirectoryStructure(fullPath)
      .andThen(() => writeFileStream(file.stream, fullPath))
      .map(() => new LocalFileIdentifier(fullPath))
  }

  load(fileId: LocalFileIdentifier): ResultAsync<File, Error> {
    return ResultAsync.fromPromise(
      fileExists(fileId.filePath).then((exists) => {
        if (!exists) {
          throw new Error('File does not exist')
        }
        return {
          path: path.relative(this._rootPath, fileId.filePath),
          stream: fs.createReadStream(fileId.filePath),
        }
      }),
      (e: any) =>
        new Error(e.message || 'Error in the fs.createReadStream phase')
    )
  }

  remove(fileId: LocalFileIdentifier): ResultAsync<null, Error> {
    return ResultAsync.fromPromise(
      fileExists(fileId.filePath).then((exists) =>
        exists ? deleteFile(fileId.filePath) : null
      ),
      (e: any) => new Error(e.message || 'Error in the fs.unlink phase')
    ).map(() => null)
  }
}
