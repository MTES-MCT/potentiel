import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface DélaiCDC2022AppliquéPayload {
  projetId: string
  nouvelleDateLimiteAchèvement: string
  ancienneDateLimiteAchèvement: string
}
export class DélaiCDC2022Appliqué
  extends BaseDomainEvent<DélaiCDC2022AppliquéPayload>
  implements DomainEvent
{
  public static type: 'DélaiCDC2022Appliqué' = 'DélaiCDC2022Appliqué'
  public type = DélaiCDC2022Appliqué.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiCDC2022AppliquéPayload) {
    return payload.projetId
  }
}
