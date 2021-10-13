import { stableStringify } from '../../../core/utils'

export const makeLegacyCandidateNotificationId = (args: { email: string; importId: string }) => {
  const { email, importId } = args
  const key = { email, importId }

  return stableStringify(key)
}
