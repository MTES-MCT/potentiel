import { Readable } from 'stream'
import { EventBus, UniqueEntityID } from '../../../core/domain'
import { fakeRepo, makeFakeEventBus } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { LegacyModificationFileAttached } from '../events'
import { makeAttachLegacyModificationFile } from './attachLegacyModificationFile'

describe('attachLegacyModificationFile', () => {
  const filename = 'fake'
  const contents = Readable.from('text123')
  const attachedBy = makeFakeUser({ id: 'abcd' })

  describe('when there is a single match for the filename', () => {
    const eventBus = makeFakeEventBus()
    const fileRepo = fakeRepo<FileObject>()

    const getLegacyModificationByFilename = jest.fn((filename: string) =>
      Promise.resolve(['projectA'])
    )

    const attachLegacyModificationFile = makeAttachLegacyModificationFile({
      eventBus: eventBus as EventBus,
      fileRepo,
      getLegacyModificationByFilename,
    })

    beforeAll(async () => {
      await attachLegacyModificationFile({
        filename,
        contents,
        attachedBy,
      })
    })

    it('should save the file', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      const savedFile = fileRepo.save.mock.calls[0][0]
      expect(savedFile).toMatchObject({
        designation: 'courrier-modification-historique',
        forProject: new UniqueEntityID('projectA'),
        createdBy: new UniqueEntityID(attachedBy.id),
        filename,
        contents,
      })
    })

    it('should trigger LegacyModificationFileAttached', () => {
      const savedFile = fileRepo.save.mock.calls[0][0]
      expect(eventBus).toHavePublishedWithPayload(LegacyModificationFileAttached, {
        fileId: savedFile.id.toString(),
        filename,
        projectId: 'projectA',
      })
    })
  })

  describe('when there is no match for the filename', () => {
    const eventBus = makeFakeEventBus()
    const fileRepo = fakeRepo<FileObject>()

    const getLegacyModificationByFilename = jest.fn((filename: string) => Promise.resolve([]))

    const attachLegacyModificationFile = makeAttachLegacyModificationFile({
      eventBus: eventBus as EventBus,
      fileRepo,
      getLegacyModificationByFilename,
    })

    it('should throw an error', async () => {
      expect.assertions(1)
      await expect(
        attachLegacyModificationFile({
          filename,
          contents,
          attachedBy,
        })
      ).rejects.toEqual(new Error('Pas de modification historique trouvée avec ce nom de fichier.'))
    })
  })

  describe('when there is multiple matches for the filename', () => {
    const eventBus = makeFakeEventBus()
    const fileRepo = fakeRepo<FileObject>()

    const getLegacyModificationByFilename = jest.fn((filename: string) =>
      Promise.resolve(['projectA', 'projectB'])
    )

    const attachLegacyModificationFile = makeAttachLegacyModificationFile({
      eventBus: eventBus as EventBus,
      fileRepo,
      getLegacyModificationByFilename,
    })

    it('should throw an error', async () => {
      expect.assertions(1)
      await expect(
        attachLegacyModificationFile({
          filename,
          contents,
          attachedBy,
        })
      ).rejects.toEqual(
        new Error('Plusieurs modifications historiques trouvées avec ce nom de fichier.')
      )
    })
  })
})
