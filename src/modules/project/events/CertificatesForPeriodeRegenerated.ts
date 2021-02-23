import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

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
  implements DomainEvent {
  public static type: 'CertificatesForPeriodeRegenerated' = 'CertificatesForPeriodeRegenerated'
  public type = CertificatesForPeriodeRegenerated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CertificatesForPeriodeRegeneratedPayload) {
    const { periodeId, appelOffreId } = payload
    const key = { appelOffreId, periodeId }
    return JSON.stringify(key, Object.keys(key).sort()) // This makes the stringify stable (key order)
  }
}
