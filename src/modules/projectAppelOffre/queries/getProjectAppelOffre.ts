import { AppelOffre, ProjectAppelOffre } from '@entities'

export type GetProjectAppelOffre = (args: {
  appelOffreId: string
  periodeId: string
  familleId?: string
}) => ProjectAppelOffre | undefined

export const makeGetProjectAppelOffre: (appelsOffre: AppelOffre[]) => GetProjectAppelOffre =
  (appelsOffres) =>
  ({ appelOffreId, periodeId, familleId }) => {
    const appelOffre = appelsOffres.find((ao) => ao.id === appelOffreId)

    if (!appelOffre) return undefined

    const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)

    if (!periode) return undefined

    const famille = appelOffre.familles.find((famille) => famille.id === familleId)

    return {
      ...appelOffre,
      periode,
      famille,
      isSoumisAuxGF: famille
        ? famille.soumisAuxGarantiesFinancieres !== 'non soumis'
        : appelOffre.soumisAuxGarantiesFinancieres !== 'non soumis',
    }
  }
