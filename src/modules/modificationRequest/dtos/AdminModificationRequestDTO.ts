export interface AdminModificationRequestDTO {
  id: string
  type: string

  versionDate: Date

  requestedOn: Date
  requestedBy: string
  justification: string
  attachmentFile: {
    filename: string
    id: string
  }

  project: {
    id: string
    numeroCRE: string
    nomProjet: string
    nomCandidat: string
    communeProjet: string
    departementProjet: string
    regionProjet: string
    puissance: number
    unitePuissance: string
    notifiedOn: Date
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
  }
}
