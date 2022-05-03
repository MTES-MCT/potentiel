import { DomainEvent, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { makeSignalerDemandeAbandon } from './signalerDemandeAbandon'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { Readable } from 'stream'

const projectId = new UniqueEntityID().toString()
const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('signalerDemandeAbandon use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      fakePublish.mockClear()

      const signalerDemandeAbandon = makeSignalerDemandeAbandon({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeAbandon({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        notes: 'notes',
        file: fakeFileContents,
        signaledBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('should save the attachment file', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
    })

    it('should call signalerDemandAbandon', () => {
      const fakeFile = fileRepo.save.mock.calls[0][0]
      expect(fakeProject.signalerDemandeAbandon).toHaveBeenCalledWith({
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        notes: 'notes',
        attachment: { id: fakeFile.id.toString(), name: fakeFileContents.filename },
        signaledBy: user,
      })
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const signalerDemandeAbandon = makeSignalerDemandeAbandon({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeAbandon({
        projectId,
        decidedOn: new Date('2022-04-12'),
        status: 'acceptée',
        signaledBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
