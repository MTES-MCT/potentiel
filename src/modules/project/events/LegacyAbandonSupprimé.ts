import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type LegacyAbandonSuppriméPayload = {
  projetId: string
  garantiesFinancieresDueOn: number
  dcrDueOn: number
  completionDueOn: number
}

export class LegacyAbandonSupprimé
  extends BaseDomainEvent<LegacyAbandonSuppriméPayload>
  implements DomainEvent
{
  public static type: 'LegacyAbandonSupprimé' = 'LegacyAbandonSupprimé'
  public type = LegacyAbandonSupprimé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyAbandonSuppriméPayload) {
    return payload.projetId
  }
}
