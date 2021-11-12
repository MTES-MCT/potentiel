import { okAsync } from 'neverthrow'
import { UniqueEntityID } from '../../../core/domain'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'
import { handleLegacyCandidateNotified } from './handleLegacyCandidateNotified'

const email = 'email@test.test'
const importId = new UniqueEntityID().toString()

describe('handleLegacyCandidateNotified', () => {
  describe('when receiving LegacyCandidateNotified', () => {
    it('should call createUser', async () => {
      const createUser = jest.fn(() => okAsync<null, never>(null))
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
