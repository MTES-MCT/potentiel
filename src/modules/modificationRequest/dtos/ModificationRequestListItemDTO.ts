export type ModificationRequestVariants =
  | { type: 'actionnaire'; actionnaire: string }
  | { type: 'fournisseur'; fournisseur: string; justification: string }
  | { type: 'producteur'; producteur: string }
  | { type: 'puissance'; puissance: number }
  | { type: 'recours'; justification: string }
  | { type: 'abandon'; justification: string }
  | { type: 'delai'; justification: string }
  | { type: 'annulation abandon' }

export type ModificationRequestStatusDTO =
  | 'envoyée'
  | 'acceptée'
  | 'rejetée'
  | 'annulée'
  | 'en instruction'
  | 'en attente de confirmation'
  | 'demande confirmée'
  | 'information validée'

export type ModificationRequestListItemDTO = {
  id: string
  status: string

  requestedOn: Date
  requestedBy: {
    email: string
    fullName: string
  }

  attachmentFile: {
    filename: string
    id: string
  }

  project: {
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    nomProjet: string
    communeProjet: string
    departementProjet: string
    regionProjet: string
    unitePuissance: string
  }
} & ModificationRequestVariants
