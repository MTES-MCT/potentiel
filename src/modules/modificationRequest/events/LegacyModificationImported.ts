import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface LegacyAbandon {
  type: 'abandon'
}

export interface LegacyRecours {
  type: 'recours'
  accepted: boolean
  motifElimination: string
}

export interface LegacyDelai {
  type: 'delai'
  nouvelleDateLimiteAchevement: number
  ancienneDateLimiteAchevement: number
}

export interface LegacyActionnaire {
  type: 'actionnaire'
  actionnairePrecedent: string
  siretPrecedent: string
}
export interface LegacyProducteur {
  type: 'producteur'
  producteurPrecedent: string
}

export type LegacyVariant =
  | LegacyAbandon
  | LegacyRecours
  | LegacyDelai
  | LegacyActionnaire
  | LegacyProducteur

// TODO: accept an array of modifications instead of single

export type LegacyModificationImportedPayload = {
  projectId: string
  modifiedOn: number
} & LegacyVariant

export class LegacyModificationImported
  extends BaseDomainEvent<LegacyModificationImportedPayload>
  implements DomainEvent
{
  public static type: 'LegacyModificationImported' = 'LegacyModificationImported'
  public type = LegacyModificationImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyModificationImportedPayload) {
    return undefined
  }
}
