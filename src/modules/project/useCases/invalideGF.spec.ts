import { DomainEvent, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeInvalideGF } from './invalideGF'

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
const projetId = new UniqueEntityID().toString()

describe('InvalideGF usecase', () => {
  describe(`Etant donné un projet avec garantie financières et que l'utilisateur n'a pas accès au projet
            Lorsque le usecase est invoqué`, () => {
    it('Alors une erreur UnauthorizedError devrait être retournée', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => false)

      const invalideGF = makeInvalideGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
      })

      const res = await invalideGF({
        projetId,
        invalidéesPar: user,
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

      const invalideGF = makeInvalideGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
      })

      const res = await invalideGF({
        projetId,
        invalidéesPar: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })

  describe(`Etant donné un projet avec garantie financières et un utilisateur DREAL
            Lorsque le usecase est invoqué`, () => {
    it('Alors un évènement ProjectGFInvalidées devrait être émis', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))
      const shouldUserAccessProject = jest.fn(async () => true)

      const invalideGF = makeInvalideGF({
        publishToEventStore: fakePublish,
        shouldUserAccessProject,
      })

      const res = await invalideGF({
        projetId,
        invalidéesPar: user,
      })

      expect(res.isOk()).toBe(true)
      expect(fakePublish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ProjectGFInvalidées',
          payload: { projetId, invalidéesPar: user.id },
        })
      )
    })
  })
})
