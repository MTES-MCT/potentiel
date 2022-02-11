import { AppelOffre, Famille, ProjectAppelOffre } from '@entities'

export type GetProjectAppelOffre = (args: {
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

    const famille = appelOffre.familles.find((famille) => famille.id === familleId)

    return {
      ...appelOffre,
      periode,
      famille,
      isSoumisAuxGFs: famille
        ? isSoumisAuxGFs(famille)
        : appelOffre.soumisAuxGarantiesFinancieres ?? false,
    }
  }

const isSoumisAuxGFs = (famille: Famille) => {
  const { soumisAuxGarantiesFinancieres, garantieFinanciereEnMois = 0 } = famille
  return soumisAuxGarantiesFinancieres === true || garantieFinanciereEnMois > 0
}
