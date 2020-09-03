import { Readable } from 'stream'
import os from 'os'
import fs, { mkdir } from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import { LocalFileService, LocalFileIdentifier } from './localFileService'

const deleteFile = util.promisify(fs.unlink)
const fileExists = util.promisify(fs.exists)
const writeFile = util.promisify(fs.writeFile)
const deleteIfExists = (path) =>
  fileExists(path).then((exists) => (exists ? deleteFile(path) : null))

const rootPath = os.tmpdir()

describe('localFileService', () => {
  const fakePath = 'test/fakeFile.txt'
  const storage: LocalFileService = new LocalFileService(rootPath)
  const targetPath = path.resolve(rootPath, fakePath)

  describe('LocalFileService.save', () => {
    const fakeFile = {
      path: fakePath,
      stream: Readable.from(['test']),
    }

    beforeAll(async () => {
      await deleteIfExists(targetPath)
    })

    afterAll(async () => {
      await deleteIfExists(targetPath)
    })

    it('should create a file in the file system', async () => {
      const result = await storage.save(fakeFile)

      if (result.isErr()) console.log('error on save', result.error)
      expect(result.isOk()).toBe(true)

      if (result.isErr()) return

      expect(result.value.filePath).toEqual(targetPath)

      const savedFile = fs.readFileSync(targetPath, 'utf8')
      expect(savedFile).toEqual('test')
    })
  })

  describe('LocalFileService.load', () => {
    describe('given an existing file', () => {
      beforeAll(async () => {
        await mkdirp(path.dirname(targetPath))
        await writeFile(targetPath, 'test')
      })

      afterAll(async () => {
        await deleteIfExists(targetPath)
      })

      it('should retrieve the file from the file system', async () => {
        const result = await storage.load(new LocalFileIdentifier(targetPath))

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

  describe('LocalFileService.remove', () => {
    describe('given an existing file', () => {
      beforeAll(async () => {
        await mkdirp(path.dirname(targetPath))
        await writeFile(targetPath, 'test')
      })

      it('should remove the file from the file system', async () => {
        const result = await storage.remove(new LocalFileIdentifier(targetPath))

        if (result.isErr()) console.log('error on remove', result.error)
        expect(result.isOk()).toBe(true)
        if (result.isErr()) return

        const fileStillExists = await fileExists(targetPath)
        expect(fileStillExists).toBe(false)
      })
    })
  })
})
