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

export type LegacyModificationDTO = {
  modifiedOn: number
} & LegacyVariant
