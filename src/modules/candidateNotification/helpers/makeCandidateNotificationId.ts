import { stableStringify } from '@core/utils'
import { Periode, Project, AppelOffre } from '@entities'

export const makeCandidateNotificationId = (args: {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  candidateEmail: Project['email']
}) => {
  const { appelOffreId, periodeId, candidateEmail } = args
  const key = { appelOffreId, periodeId, candidateEmail }

  return stableStringify(key)
}
