import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { stableStringify } from '@core/utils'

export interface CertificatesForPeriodeRegeneratedPayload {
  periodeId: string
  appelOffreId: string
  familleId?: string
  requestedBy: string
  newNotifiedOn?: number
  reason?: string
}
export class CertificatesForPeriodeRegenerated
  extends BaseDomainEvent<CertificatesForPeriodeRegeneratedPayload>
  implements DomainEvent
{
  public static type: 'CertificatesForPeriodeRegenerated' = 'CertificatesForPeriodeRegenerated'
  public type = CertificatesForPeriodeRegenerated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CertificatesForPeriodeRegeneratedPayload) {
    const { periodeId, appelOffreId } = payload
    const key = { appelOffreId, periodeId }
    return stableStringify(key)
  }
}
