import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { makeRemoveGF } from './removeGF'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'

const projectId = new UniqueEntityID().toString()

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('removeGF use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      fakePublish.mockClear()

      const removeGF = makeRemoveGF({
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await removeGF({
        projectId,
        removedBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('should remove the GF', () => {
      expect(fakeProject.removeGarantiesFinancieres).toHaveBeenCalledWith(user)
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const removeGF = makeRemoveGF({
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await removeGF({
        projectId,
        removedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
