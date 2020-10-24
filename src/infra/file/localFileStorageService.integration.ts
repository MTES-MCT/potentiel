import { Readable } from 'stream'
import os from 'os'
import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import { LocalFileStorageService } from './localFileStorageService'
import { pathExists } from '../../core/utils'

const deleteFile = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)

const deleteFileIfExists = (path) => {
  pathExists(path).then((exists) => (exists ? deleteFile(path) : null))
}

const rootPath = os.tmpdir()

describe('localFileStorageService', () => {
  const fakePath = 'test/fakeFile.txt'
  const storage: LocalFileStorageService = new LocalFileStorageService(rootPath)
  const targetPath = path.resolve(rootPath, fakePath)

  describe('LocalFileStorageService.save', () => {
    const fakeFile = {
      path: fakePath,
      stream: Readable.from(['test']),
    }

    beforeAll(async () => {
      await deleteFileIfExists(targetPath)
    })

    afterAll(async () => {
      await deleteFileIfExists(targetPath)
    })

    it('should create a file in the file system', async () => {
      const result = await storage.save(fakeFile)

      if (result.isErr()) console.log('error on save', result.error)
      expect(result.isOk()).toBe(true)

      if (result.isErr()) return

      expect(result.value).toEqual(`localFile:${fakePath}`)

      const savedFile = fs.readFileSync(targetPath, 'utf8')
      expect(savedFile).toEqual('test')
    })
  })

  describe('LocalFileStorageService.load', () => {
    describe('given an existing file', () => {
      beforeAll(async () => {
        await mkdirp(path.dirname(targetPath))
        await writeFile(targetPath, 'test')
      })

      afterAll(async () => {
        await deleteFileIfExists(targetPath)
      })

      it('should retrieve the file from the file system', async () => {
        const result = await storage.load(`localFile:${fakePath}`)

        if (result.isErr()) console.log('error on load', result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        expect(result.value.path).toEqual(fakePath)

        const downloadedFile = await new Promise((resolve, reject) => {
          let fileContents = ''
          result.value.stream.on('data', (chunk) => {
            fileContents += chunk
          })
          result.value.stream.on('error', (err) => {
            reject(err)
          })
          result.value.stream.on('end', () => {
            resolve(fileContents)
          })
        })

        expect(downloadedFile).toEqual('test')
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

        if (result.isErr()) console.log('error on remove', result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const fileStillExists = await pathExists(targetPath)
        expect(fileStillExists).toBe(false)
      })
    })
  })
})
