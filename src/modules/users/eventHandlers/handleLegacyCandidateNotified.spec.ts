import { UniqueEntityID } from '@core/domain'
import { makeFakeCreateUser } from '../../../__tests__/fakes'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'
import { handleLegacyCandidateNotified } from './handleLegacyCandidateNotified'

const email = 'email@test.test'
const importId = new UniqueEntityID().toString()

describe('handleLegacyCandidateNotified', () => {
  describe('when receiving LegacyCandidateNotified', () => {
    it('should call createUser', async () => {
      const createUser = makeFakeCreateUser()
      await handleLegacyCandidateNotified({ createUser })(
        new LegacyCandidateNotified({
          payload: {
            email,
            importId,
          },
        })
      )

      expect(createUser).toHaveBeenCalledWith({ email, role: 'porteur-projet' })
    })
  })
})
