import { UniqueEntityID } from '../../../../core/domain'
import { resetDatabase } from '../../helpers'
import { ProjectEvent } from '../../projectionsNext'
import { getLegacyModificationByFilename } from './getLegacyModificationByFilename'

describe('getLegacyModificationByFilename', () => {
  const filename = '123.pdf'
  describe('when there is no legacy modification with this filename', () => {
    it('should return an empty array', async () => {
      await resetDatabase()
      const res = await getLegacyModificationByFilename(filename)
      expect(res).toHaveLength(0)
    })
  })

  describe('when there are legacy modifications with this filename', () => {
    it('should return the project ids', async () => {
      await resetDatabase()

      const projectId1 = new UniqueEntityID().toString()
      const projectId2 = new UniqueEntityID().toString()

      await ProjectEvent.bulkCreate([
        {
          id: new UniqueEntityID().toString(),
          projectId: projectId1,
          type: 'LegacyModificationImported',
          payload: { filename },
          eventPublishedAt: 1,
        },
        {
          id: new UniqueEntityID().toString(),
          projectId: projectId2,
          type: 'LegacyModificationImported',
          payload: { filename },
          eventPublishedAt: 1,
        },
        {
          id: new UniqueEntityID().toString(),
          projectId: new UniqueEntityID().toString(),
          type: 'LegacyModificationImported',
          payload: { filename: 'other.pdf' },
          eventPublishedAt: 1,
        },
      ])

      const res = await getLegacyModificationByFilename(filename)
      expect(res).toEqual([projectId1, projectId2])
    })
  })

  describe('when there are multiple legacy modifications with this filename for the same project', () => {
    it('should return the project id just once', async () => {
      await resetDatabase()

      const projectId1 = new UniqueEntityID().toString()

      await ProjectEvent.bulkCreate([
        {
          id: new UniqueEntityID().toString(),
          projectId: projectId1,
          type: 'LegacyModificationImported',
          payload: { filename },
          eventPublishedAt: 1,
        },
        {
          id: new UniqueEntityID().toString(),
          projectId: projectId1,
          type: 'LegacyModificationImported',
          payload: { filename },
          eventPublishedAt: 1,
        },
      ])

      const res = await getLegacyModificationByFilename(filename)
      expect(res).toEqual([projectId1])
    })
  })
})
