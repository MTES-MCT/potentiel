import { FileRepo } from './fileRepo'
import { File } from '../../../modules/file'
import { v4 as uuid } from 'uuid'
import models from '../models'
import { sequelize } from '../../../sequelize.config'

describe('Sequelize FileRepo', () => {
  const fileRepo = new FileRepo(models)

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })
  })

  describe('save(file)', () => {
    let file: File

    beforeAll(() => {
      const fileResult = File.create({
        filename: 'db.filename',
        forProject: 'db.forProject',
        createdBy: 'db.createdBy',
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
      const fileId = uuid()

      beforeAll(async () => {
        const FileModel = models.File
        await FileModel.create({
          id: fileId,
          filename: 'db.filename',
          forProject: 'db.forProject',
          createdBy: 'db.createdBy',
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
        expect(file.forProject).toEqual('db.forProject')
      })
    })
  })
})
