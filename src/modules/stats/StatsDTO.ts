export interface StatsDTO {
  projetsTotal: number
  projetsLaureats: number
  porteursProjetNotifies: number
  porteursProjetNotifiesInscrits: number
  parrainages: number
  telechargementsAttestation: number
  projetsAvecAttestation: number
  gfDeposees: number
  gfDues: number
  dcrDeposees: number
  dcrDues: number
  demandes: {
    actionnaire: number
    producteur: number
    fournisseur: number
    puissance: number
    abandon: number
    recours: number
    delai: number
  }
}
