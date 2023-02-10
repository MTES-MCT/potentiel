import { FiltreListeProjets } from '@modules/project'
import { Pagination } from '../../../../../types'
import models from '../../../models'
import { listerProjetsNonNotifiés } from './requêtes/listerProjetsNonNotifiés'

export const newListerProjetsÀNotifier = async ({
  pagination,
  filtres,
}: {
  pagination: Pagination
  filtres?: FiltreListeProjets
}) => {
  const projetsNonNotifiés = await models.Project.findAll({
    where: { notifiedOn: 0 },
    attributes: ['appelOffreId', 'periodeId'],
  })

  const listeAOs = projetsNonNotifiés.reduce(
    (acc, projet) =>
      acc.some((element) => element === projet.appelOffreId) ? acc : [...acc, projet.appelOffreId],
    []
  )

  const AOSélectionné = filtres?.appelOffre?.appelOffreId ?? listeAOs[0]

  const listePériodes = projetsNonNotifiés.reduce(
    (acc, projet) =>
      projet.appelOffreId === AOSélectionné && !acc.some((element) => element === projet.periodeId)
        ? [...acc, projet.periodeId]
        : acc,
    []
  )

  const périodeSélectionnée = filtres?.appelOffre?.periodeId ?? listePériodes[0]

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
