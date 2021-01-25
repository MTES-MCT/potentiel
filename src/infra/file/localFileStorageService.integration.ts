import { Readable } from 'stream'
import os from 'os'
import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import { makeLocalFileStorageService } from './localFileStorageService'
import { logger, pathExists } from '../../core/utils'
import { FileNotFoundError } from '../../modules/file'

const deleteFile = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)

const deleteFileIfExists = (path) => {
  pathExists(path).then((exists) => (exists ? deleteFile(path) : null))
}

const rootPath = os.tmpdir()

describe('localFileStorageService', () => {
  const fakePath = 'test/fakeFile.txt'
  const storage = makeLocalFileStorageService(rootPath)
  const targetPath = path.resolve(rootPath, fakePath)

  describe('upload', () => {
    const fakeContents = Readable.from(['test'])

    beforeAll(async () => {
      await deleteFileIfExists(targetPath)
    })

    afterAll(async () => {
      await deleteFileIfExists(targetPath)
    })

    it('should create a file in the file system', async () => {
      const result = await storage.upload({ contents: fakeContents, path: fakePath })

      if (result.isErr()) logger.error(result.error)
      expect(result.isOk()).toBe(true)

      if (result.isErr()) return

      expect(result.value).toEqual(`localFile:${fakePath}`)

      const savedFile = fs.readFileSync(targetPath, 'utf8')
      expect(savedFile).toEqual('test')
    })
  })

  describe('download', () => {
    describe('given an existing file', () => {
      beforeAll(async () => {
        await mkdirp(path.dirname(targetPath))
        await writeFile(targetPath, 'test')
      })

      afterAll(async () => {
        await deleteFileIfExists(targetPath)
      })

      it('should retrieve the file from the file system', async () => {
        const result = await storage.download(`localFile:${fakePath}`)

        if (result.isErr()) logger.error(result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const downloadedFile = await new Promise((resolve, reject) => {
          let fileContents = ''
          result.value.on('data', (chunk) => {
            fileContents += chunk
          })
          result.value.on('error', (err) => {
            reject(err)
          })
          result.value.on('end', () => {
            resolve(fileContents)
          })
        })

        expect(downloadedFile).toEqual('test')
      })
    })

    describe('given an missing file', () => {
      it('should return a FileNotFoundError', async () => {
        const result = await storage.download(`localFile:doesNotExist`)

        expect(result.isErr()).toBe(true)
        if (result.isOk()) return

        expect(result.error).toBeInstanceOf(FileNotFoundError)
      })
    })
  })

  describe('LocalFileStorageService.remove', () => {
    describe('given an existing file', () => {
      beforeAll(async () => {
        await mkdirp(path.dirname(targetPath))
        await writeFile(targetPath, 'test')
      })

      it('should remove the file from the file system', async () => {
        const result = await storage.remove(`localFile:${fakePath}`)

        if (result.isErr()) logger.error(result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const fileStillExists = await pathExists(targetPath)
        expect(fileStillExists).toBe(false)
      })
    })
    describe('given an missing file', () => {
      it('should return a FileNotFoundError', async () => {
        const result = await storage.remove(`localFile:doesNotExist`)

        expect(result.isErr()).toBe(true)
        if (result.isOk()) return

        expect(result.error).toBeInstanceOf(FileNotFoundError)
      })
    })
  })
})
