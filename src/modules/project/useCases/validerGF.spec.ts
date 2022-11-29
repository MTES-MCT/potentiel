import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeValiderGF } from './validerGF'
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { GFDéjàValidéesError } from '../errors'

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
const projetId = new UniqueEntityID().toString()

const fakeProject = makeFakeProject()

describe('ValiderGF usecase', () => {
  describe(`Etant donné un projet avec garantie financières et que l'utilisateur n'a pas accès au projet
            Lorsque le usecase est invoqué`, () => {
    it('Alors une erreur UnauthorizedError devrait être retournée', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => false)
      const projectRepo = fakeRepo(fakeProject as Project)

      const validerGF = makeValiderGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await validerGF({
        projetId,
        validéesPar: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Etant donné un projet avec garantie financières et que l'utilisateur n'est pas DREAL
            Lorsque le usecase est invoqué`, () => {
    it('Alors une erreur UnauthorizedError devrait être retournée', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
      const shouldUserAccessProject = jest.fn(async () => false)
      const projectRepo = fakeRepo(fakeProject as Project)

      const validerGF = makeValiderGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await validerGF({
        projetId,
        validéesPar: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Etant donné un projet avec garantie financières déjà validées
            Lorsque le usecase est invoqué`, () => {
    it('Alors une erreur GFDéjàValidéesError devrait être retournée', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => true)
      const projectRepo = fakeRepo({ ...fakeProject, GFValidées: true } as Project)
      const validerGF = makeValiderGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await validerGF({
        projetId,
        validéesPar: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(GFDéjàValidéesError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Etant donné un projet avec garantie financières et un utilisateur DREAL
            Lorsque le usecase est invoqué`, () => {
    it('Alors un évènement ProjectGFValidées devrait être émis', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => true)
      const projectRepo = fakeRepo(fakeProject as Project)

      const validerGF = makeValiderGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await validerGF({
        projetId,
        validéesPar: user,
      })

      expect(res.isOk()).toBe(true)
      expect(fakePublish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ProjectGFValidées',
          payload: { projetId, validéesPar: user.id },
        })
      )
    })
  })
})
