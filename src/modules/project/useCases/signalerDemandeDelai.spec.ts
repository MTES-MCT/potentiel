import { DomainEvent, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { makeSignalerDemandeDelai } from './signalerDemandeDelai'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'

const projectId = new UniqueEntityID().toString()

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('signalerDemandeDelai use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      fakePublish.mockClear()

      const signalerDemandeDelai = makeSignalerDemandeDelai({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeDelai({
        projectId,
        decidedOn: new Date('2022-04-12').getTime(),
        isAccepted: true,
        newCompletionDueOn: new Date('2025-01-31').getTime(),
        signaledBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('should call signalerDemandDelai', () => {
      expect(fakeProject.signalerDemandeDelai).toHaveBeenCalledWith({
        decidedOn: new Date('2022-04-12'),
        isAccepted: true,
        newCompletionDueOn: new Date('2025-01-31'),
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

      const signalerDemandeDelai = makeSignalerDemandeDelai({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await signalerDemandeDelai({
        projectId,
        decidedOn: new Date('2022-04-12').getTime(),
        isAccepted: true,
        newCompletionDueOn: new Date('2025-01-31').getTime(),
        signaledBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
