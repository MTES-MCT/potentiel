import { Project } from '../../../entities'
import { GarantiesFinancieresListDTO } from '../dtos/GarantiesFinancieresList'

export const toGarantiesFinancieresList = (projects: Project[]): GarantiesFinancieresListDTO => ({
  projects: projects.map((project) => ({
    projectId: project.id,
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    nomProjet: project.nomProjet,
    communeProjet: project.communeProjet,
    departementProjet: project.departementProjet,
    regionProjet: project.regionProjet,
    nomCandidat: project.nomCandidat,
    nomRepresentantLegal: project.nomRepresentantLegal,
    email: project.email,
    garantieFinanciere: {
      date: new Date(project.garantiesFinancieresDate),
      file: project.garantiesFinancieresFileRef,
    },
  })),
})
