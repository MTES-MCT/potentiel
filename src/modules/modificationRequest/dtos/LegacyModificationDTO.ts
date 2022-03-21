export type LegacyAbandon = {
  type: 'abandon'
  accepted: boolean
}

export type LegacyRecours = {
  type: 'recours'
  accepted: boolean
  motifElimination: string
}

export type LegacyDelai = {
  type: 'delai'
} & (
  | { accepted: true; nouvelleDateLimiteAchevement: number; ancienneDateLimiteAchevement: number }
  | { accepted: false }
)

export type LegacyActionnaire = {
  type: 'actionnaire'
  actionnairePrecedent: string
  siretPrecedent: string
}
export type LegacyProducteur = {
  type: 'producteur'
  producteurPrecedent: string
}

export type LegacyAutre = {
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
  filename?: string
} & LegacyVariant
