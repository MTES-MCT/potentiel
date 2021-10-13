import { makeCreateUser } from '..'
import { LegacyCandidateNotified } from '../../legacyCandidateNotification'

export const handleLegacyCandidateNotified = (deps: {
  createUser: ReturnType<typeof makeCreateUser>
}) => async (event: LegacyCandidateNotified) => {
  const { createUser } = deps
  const { email } = event.payload

  await createUser({ email, role: 'porteur-projet' })
}
