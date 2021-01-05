export interface ModificationRequestPageDTO {
  id: string
  type: string
  status: string

  respondedBy?: string
  respondedOn?: Date

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
