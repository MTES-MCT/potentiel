export interface LegacyAbandon {
  type: 'abandon'
  accepted: boolean
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
  accepted: boolean
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

export interface LegacyAutre {
  type: 'autre'
  column: string
  value: string
}

export type LegacyVariant =
  | LegacyAbandon
  | LegacyRecours
  | LegacyDelai
  | LegacyActionnaire
  | LegacyProducteur
  | LegacyAutre

export type LegacyModificationDTO = {
  modifiedOn: number
  modificationId: string
} & LegacyVariant
