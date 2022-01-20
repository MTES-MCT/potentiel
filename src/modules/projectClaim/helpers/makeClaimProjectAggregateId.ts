import { stableStringify } from '@core/utils'

export const makeClaimProjectAggregateId = (args: { projectId: string; claimedBy: string }) => {
  const { projectId, claimedBy } = args
  const key = { projectId, claimedBy }

  return stableStringify(key)
}
