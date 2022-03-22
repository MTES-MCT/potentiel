export type LegacyModificationStatus = 'acceptée' | 'rejetée' | 'accord-de-principe'

export type LegacyAbandon = {
  type: 'abandon'
}

export type LegacyRecours = {
  type: 'recours'
  motifElimination: string
}

export type LegacyDelai = {
  type: 'delai'
} & (
  | {
      status: Extract<LegacyModificationStatus, 'acceptée' | 'accord-de-principe'>
      nouvelleDateLimiteAchevement: number
      ancienneDateLimiteAchevement: number
    }
  | { status: Extract<LegacyModificationStatus, 'rejetée'> }
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
  status: LegacyModificationStatus
} & LegacyVariant
