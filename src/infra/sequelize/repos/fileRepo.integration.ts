import { FileRepo } from './fileRepo'
import { File } from '../../../modules/file'
import models from '../models'
import { resetDatabase } from '../../../dataAccess'
import { UniqueEntityID } from '../../../core/domain'
import { v4 as uuid } from 'uuid'

describe('Sequelize FileRepo', () => {
  const fileRepo = new FileRepo(models)

  beforeAll(async () => {
    await resetDatabase()
  })

  describe('save(file)', () => {
    let file: File

    beforeAll(() => {
      const fileResult = File.create({
        filename: 'db.filename',
        forProject: uuid(),
        createdBy: uuid(),
        createdAt: new Date(),
        designation: 'other',
      })

      expect(fileResult.isOk()).toBe(true)
      if (fileResult.isErr()) return

      file = fileResult.value
    })

    it('should save the File to database', async () => {
      const saveResult = await fileRepo.save(file)

      if (saveResult.isErr()) console.log(saveResult.error.message)
      expect(saveResult.isOk()).toBe(true)

      const FileModel = models.File

      const retrievedFile = await FileModel.findByPk(file.id.toString())

      expect(retrievedFile).toBeDefined()
      expect(retrievedFile.filename).toEqual('db.filename')
    })
  })

  describe('load(fileId)', () => {
    describe('when the File exists', () => {
      const fileId = new UniqueEntityID()
      const projectId = uuid()

      beforeAll(async () => {
        const FileModel = models.File

        await FileModel.create({
          id: fileId.toString(),
          filename: 'db.filename',
          forProject: projectId,
          createdBy: uuid(),
          createdAt: Date.now(),
          designation: 'other',
        })
      })

      it('should return a File', async () => {
        const fileResult = await fileRepo.load(fileId)
        expect(fileResult.isOk()).toBe(true)

        if (fileResult.isErr()) return

        const file = fileResult.value

        expect(file).toBeInstanceOf(File)
        expect(file.forProject).toEqual(projectId)
      })
    })
  })
})
