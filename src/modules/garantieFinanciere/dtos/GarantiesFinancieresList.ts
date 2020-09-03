import { Project } from '../../../entities'

export interface GarantiesFinancieresListDTO {
  projects: {
    projectId: string
    appelOffreId: string
    periodeId: string
    familleId: string
    nomProjet: string
    communeProjet: string
    departementProjet: string
    regionProjet: string
    nomCandidat: string
    nomRepresentantLegal: string
    email: string
    garantieFinanciere: {
      date: Date
      file?: {
        id: string
        filename: string
      }
    }
  }[]
}
