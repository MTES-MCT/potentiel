import { CreateUser } from '..'
import { logger } from '@core/utils'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'

export const handleLegacyCandidateNotified = (deps: { createUser: CreateUser }) => async (
  event: LegacyCandidateNotified
) => {
  console.log('users.handleLegacyCandidateNotified')
  const { createUser } = deps
  const { email } = event.payload

  const res = await createUser({ email, role: 'porteur-projet' })

  if (res.isErr()) {
    logger.error(res.error)
  }
}
