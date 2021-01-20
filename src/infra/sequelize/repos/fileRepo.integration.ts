import { Readable } from 'stream'
import { UniqueEntityID } from '../../../core/domain'
import { logger, okAsync, UnwrapForTest } from '../../../core/utils'
import { resetDatabase } from '../helpers'
import { FileContents, FileObject, FileStorageService, makeFileObject } from '../../../modules/file'
import { EntityNotFoundError } from '../../../modules/shared'
import models from '../models'
import { makeFileRepo } from './fileRepo'

describe('Sequelize FileRepo', () => {
  const fakeFileStream = Readable.from('text123')
  const fileStorageService: FileStorageService = {
    upload: jest.fn((args: { contents: FileContents; path: string }) => okAsync('storageLocation')),
    download: jest.fn((storedAt: string) => okAsync(fakeFileStream)),
    remove: jest.fn(),
  }

  const fileRepo = makeFileRepo({ models, fileStorageService })

  beforeAll(async () => {
    await resetDatabase()
  })

  const projectId = new UniqueEntityID()
  const userId = new UniqueEntityID()

  describe('save(file)', () => {
    const projectId = new UniqueEntityID()
    const userId = new UniqueEntityID()

    const file = UnwrapForTest(
      makeFileObject({
        filename: 'db.filename',
        forProject: projectId,
        createdBy: userId,
        createdAt: new Date(),
        designation: 'other',
        contents: Readable.from('text'),
      })
    )

    beforeAll(async () => {
      const saveResult = await fileRepo.save(file)

      if (saveResult.isErr()) logger.error(saveResult.error)
      expect(saveResult.isOk()).toBe(true)
    })

    it('should upload the file using the fileStorageService', () => {
      const { contents, path } = file
      expect(fileStorageService.upload).toHaveBeenCalledWith({
        contents,
        path,
      })
    })

    it('should save the File to database', async () => {
      const FileModel = models.File

      const retrievedFile = await FileModel.findByPk(file.id.toString())

      expect(retrievedFile).toBeDefined()
      expect(retrievedFile.filename).toEqual(file.filename)
      expect(retrievedFile.forProject).toEqual(projectId.toString())
      expect(retrievedFile.createdBy).toEqual(userId.toString())
      expect(retrievedFile.createdAt).toEqual(file.createdAt)
      expect(retrievedFile.designation).toEqual(file.designation)
      expect(retrievedFile.storedAt).toEqual('storageLocation')
    })
  })

  describe('load(fileId)', () => {
    describe('when the file exists', () => {
      const fileId = new UniqueEntityID()

      const creationDate = new Date()

      let retrievedFile: FileObject | undefined

      beforeAll(async () => {
        const FileModel = models.File
        await FileModel.destroy({ truncate: true })

        await FileModel.create({
          id: fileId.toString(),
          filename: 'db.filename',
          forProject: projectId.toString(),
          createdBy: userId.toString(),
          createdAt: creationDate,
          designation: 'other',
          storedAt: 'storageLocation',
        })
      })

      it('should return a File', async () => {
        const fileResult = await fileRepo.load(fileId)
        expect(fileResult.isOk()).toBe(true)

        if (fileResult.isErr()) return

        retrievedFile = fileResult.value
      })

      it('should return a the file properties', async () => {
        expect(retrievedFile).toBeDefined()
        if (!retrievedFile) return
        expect(retrievedFile.filename).toEqual('db.filename')
        expect(retrievedFile.forProject).toEqual(projectId)
        expect(retrievedFile.createdBy).toEqual(userId)
        expect(retrievedFile.createdAt).toEqual(creationDate)
        expect(retrievedFile.designation).toEqual('other')
      })

      it('should return the file contents from the file storage service', () => {
        expect(fileStorageService.download).toHaveBeenCalledWith('storageLocation')
        if (!retrievedFile) return
        expect(retrievedFile.contents).toEqual(fakeFileStream)
      })
    })
  })

  describe('when the file does not exist', () => {
    const fileId = new UniqueEntityID()

    beforeAll(async () => {
      const FileModel = models.File
      await FileModel.destroy({ truncate: true })
    })

    it('should return an EntityNotFoundError', async () => {
      const fileResult = await fileRepo.load(fileId)
      expect(fileResult.isErr()).toBe(true)

      if (fileResult.isOk()) return

      expect(fileResult.error).toBeInstanceOf(EntityNotFoundError)
    })
  })
})
