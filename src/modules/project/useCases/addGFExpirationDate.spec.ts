import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { makeAddGFExpirationDate } from './addGFExpirationDate'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'

const projectId = new UniqueEntityID().toString()

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('addExpirationDate use-case', () => {
  describe("when the user doesn't have rights on the project", () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const addGFExpirationDate = makeAddGFExpirationDate({
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await addGFExpirationDate({
        projectId,
        submittedBy: user,
        expirationDate: new Date('2022-05-16'),
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('when the user has rights on the project', () => {
    it('should call project.addGFExpirationDate method', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => true)

      const addGFExpirationDate = makeAddGFExpirationDate({
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await addGFExpirationDate({
        projectId,
        submittedBy: user,
        expirationDate: new Date('2022-05-16'),
      })

      expect(res.isOk()).toBe(true)
      expect(fakeProject.addGFExpirationDate).toHaveBeenCalled()
      expect(fakeProject.addGFExpirationDate).toHaveBeenCalledWith({
        projectId,
        submittedBy: user,
        expirationDate: new Date('2022-05-16'),
      })
    })
  })
})
