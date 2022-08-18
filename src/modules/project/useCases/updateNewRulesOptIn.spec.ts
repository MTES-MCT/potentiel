import { DomainEvent, EventBus, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeUpdateNewRulesOptIn } from './updateNewRulesOptIn'
import { Project, ProjectNewRulesOptedIn } from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'

describe('ProjectSteps.updateNewRulesOptIn()', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const projectId = new UniqueEntityID().toString()

  const fakeEventBus: EventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }

  const projectRepo = fakeRepo({ ...makeFakeProject(), newRulesOptIn: false } as Project)

  describe('When user is not authorized to access the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => false)

      const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await updateNewRulesOptIn({
        projectId,
        optedInBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe('When user is authorized', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
      eventBus: fakeEventBus,
      shouldUserAccessProject,
      projectRepo,
    })

    it('should emit ProjectNewRulesOptedIn', async () => {
      fakePublish.mockClear()

      const res = await updateNewRulesOptIn({
        projectId,
        optedInBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })

      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectNewRulesOptedIn.type) as ProjectNewRulesOptedIn

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId)
    })
  })

  describe(`Lorsque le projet est déjà souscrit au nouveau CDC`, () => {
    it('doit retourner une erreur NouveauCahierDesChargesDéjàSouscrit', async () => {
      fakePublish.mockClear()

      const shouldUserAccessProject = jest.fn(async () => true)

      const updateNewRulesOptIn = makeUpdateNewRulesOptIn({
        eventBus: fakeEventBus,
        shouldUserAccessProject,
        projectRepo: fakeRepo({ ...makeFakeProject(), newRulesOptIn: true } as Project),
      })

      const res = await updateNewRulesOptIn({
        projectId,
        optedInBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesDéjàSouscrit)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
