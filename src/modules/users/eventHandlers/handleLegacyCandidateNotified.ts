import { makeCreateUser } from '..'
import { logger } from '../../../core/utils'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'

export const handleLegacyCandidateNotified = (deps: {
  createUser: ReturnType<typeof makeCreateUser>
}) => async (event: LegacyCandidateNotified) => {
  console.log('users.handleLegacyCandidateNotified')
  const { createUser } = deps
  const { email } = event.payload

  const res = await createUser({ email, role: 'porteur-projet' })

  if (res.isErr()) {
    logger.error(res.error)
  }
}
