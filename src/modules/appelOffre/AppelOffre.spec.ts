import { UniqueEntityID } from '../../core/domain'
import { makeUser } from '../../entities'
import { UnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { UnauthorizedError } from '../shared'
import { makeAppelOffre } from './AppelOffre'
import { AppelOffreCreated, AppelOffreUpdated } from './events'

describe('AppelOffre', () => {
  describe('update()', () => {
    const appelOffreId = new UniqueEntityID()

    describe('when user is admin', () => {
      const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

      const appelOffre = makeAppelOffre({
        id: appelOffreId,
        events: [
          new AppelOffreCreated({
            payload: {
              appelOffreId: appelOffreId.toString(),
              createdBy: '',
              data: {
                param1: 'value1',
                param2: 'value2',
              },
            },
          }),
        ],
      })._unsafeUnwrap()

      it('should trigger AppelOffreUpdated with a computed delta', () => {
        appelOffre
          .update({
            data: {
              param1: 'value1',
              param2: 'newvalue2',
              param3: 'value3',
            },
            updatedBy: fakeUser,
          })
          ._unsafeUnwrap()

        expect(appelOffre.pendingEvents).toHaveLength(1)
        const event = appelOffre.pendingEvents[0]
        expect(event).toBeInstanceOf(AppelOffreUpdated)
        expect((event as AppelOffreUpdated).payload).toMatchObject({
          appelOffreId: appelOffreId.toString(),
          updatedBy: fakeUser.id,
          delta: {
            param2: 'newvalue2',
            param3: 'value3',
          },
        })
      })
    })

    describe('when user is not admin', () => {
      const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const appelOffre = makeAppelOffre({
        id: appelOffreId,
        events: [
          new AppelOffreCreated({
            payload: {
              appelOffreId: appelOffreId.toString(),
              createdBy: '',
              data: {
                param1: 'value1',
                param2: 'value2',
              },
            },
          }),
        ],
      })._unsafeUnwrap()

      it('should return an UnauthorizedError', () => {
        const res = appelOffre.update({
          data: {
            param1: 'value1',
            param2: 'newvalue2',
            param3: 'value3',
          },
          updatedBy: fakeUser,
        })

        expect(res.isErr()).toBe(true)
        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      })
    })
  })
})
