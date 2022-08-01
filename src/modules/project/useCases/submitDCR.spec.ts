import { Readable } from 'stream'
import { DomainEvent, EventBus, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { ProjectDCRSubmitted } from '../events'
import { makeSubmitDCR } from './submitDCR'

const projectId = new UniqueEntityID().toString()

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

const fileRepo = {
  save: jest.fn(),
  load: jest.fn(),
}

const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

describe('submitDCR use-case', () => {
  describe(`Lorsque l'utilisateur n'a pas les droits sur le projet`, () => {
    it('Alors une erreur de type UnauthorizedError doit être retournée', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const submitDCR = makeSubmitDCR({
        eventBus: fakeEventBus,
        fileRepo,
        shouldUserAccessProject,
      })

      const res = await submitDCR({
        type: 'dcr',
        file: fakeFileContents,
        stepDate: new Date(123),
        projectId,
        submittedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Lorsque l'utilisateur a les droits d'accès au projet`, () => {
    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const dcrDate = new Date(123)

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      fakePublish.mockClear()

      const submitDCR = makeSubmitDCR({
        eventBus: fakeEventBus,
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
      })

      const res = await submitDCR({
        type: 'dcr',
        file: fakeFileContents,
        stepDate: dcrDate,
        numeroDossier: 'dossier123',
        projectId,
        submittedBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('Le fichier doit-être sauvegardé', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
    })

    it(`L'évènement ProjectDCRSubmitted doit être publié`, async () => {
      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectDCRSubmitted.type) as ProjectDCRSubmitted

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId)

      const fakeFile = fileRepo.save.mock.calls[0][0]

      expect(targetEvent.payload.dcrDate).toEqual(dcrDate)
      expect(targetEvent.payload.numeroDossier).toEqual('dossier123')
      expect(targetEvent.payload.fileId).toEqual(fakeFile.id.toString())
      expect(targetEvent.payload.submittedBy).toEqual(user.id)
    })
  })
})
