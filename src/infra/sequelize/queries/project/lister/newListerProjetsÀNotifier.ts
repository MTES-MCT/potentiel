import models from '../../../models'
import { listerProjetsNonNotifiés } from './requêtes/listerProjetsNonNotifiés'

export const newListerProjetsÀNotifier = async ({ pagination }) => {
  const projetsNonNotifiés = await models.Project.findAll({
    where: { notifiedOn: 0 },
    attributes: ['notifiedOn', 'appelOffreId', 'periodeId'],
  })

  const listeAOs = projetsNonNotifiés.reduce(
    (acc, current) =>
      acc.some((element) => element === current.appelOffreId)
        ? acc
        : [...acc, current.appelOffreId],
    []
  )

  const AOSélectionné = listeAOs[0]

  const projetsAOSélectionné = projetsNonNotifiés.filter(
    (projet) => projet.appelOffreId === AOSélectionné
  )

  const listePériodes = projetsAOSélectionné.reduce(
    (acc, current) =>
      acc.some((element) => element === current.periodeId) ? acc : [...acc, current.periodeId],
    []
  )

  const périodeSélectionnée = listePériodes[0]

  const projetsPériodeSélectionnée = await listerProjetsNonNotifiés({
    pagination,
    filtres: {
      appelOffre: {
        appelOffreId: AOSélectionné,
        periodeId: périodeSélectionnée,
      },
    },
  })

  return {
    listeAOs,
    AOSélectionné,
    listePériodes,
    périodeSélectionnée,
    projetsPériodeSélectionnée,
  }
}
