import { appelsOffreStatic } from './appelOffre'

export const isPeriodeLegacy = async (args: { appelOffreId: string; periodeId: string }) => {
  const appelOffre = appelsOffreStatic.find((ao) => ao.id === args.appelOffreId)

  if (!appelOffre) return false

  const periode = appelOffre.periodes.find((periode) => periode.id === args.periodeId)

  if (!periode) return false

  return !periode.isNotifiedOnPotentiel
}
