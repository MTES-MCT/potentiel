import { UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { User } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { GetPeriodeTitle } from '../../appelOffre'
import { NotificationArgs } from '../../notification'
import { InfraNotAvailableError } from '../../shared'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'
import { handleLegacyCandidateNotified } from './handleLegacyCandidateNotified'
import makeFakeProject from '../../../__tests__/fixtures/project'

const email = 'email@test.test'
const importId = new UniqueEntityID().toString()

describe('handleLegacyCandidateNotified', () => {
  describe('when receiving LegacyCandidateNotified', () => {
    it('should call createUser', async () => {
      const createUser = jest.fn()
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
