import { AppelOffre, ProjectAppelOffre } from '@entities'

type GetProjectAppelOffre = (args: {
  appelOffreId: string
  periodeId: string
  familleId?: string
}) => ProjectAppelOffre | null

export const makeGetProjectAppelOffre: (appelsOffre: AppelOffre[]) => GetProjectAppelOffre =
  (appelsOffres) =>
  ({ appelOffreId, periodeId, familleId }) => {
    const appelOffre = appelsOffres.find((ao) => ao.id === appelOffreId)

    if (!appelOffre) return null

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

    if (!periode) return null

    return {
      ...appelOffre,
      periode,
      famille: appelOffre.familles.find((famille) => famille.id === familleId),
    }
  }
