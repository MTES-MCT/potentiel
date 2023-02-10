import { GetDonnéesPourPageNotificationCandidats } from '@modules/notificationCandidats/queries'
import models from '../../../models'
import { listerProjetsNonNotifiés } from './requêtes/listerProjetsNonNotifiés'

export const getDonnéesPourPageNotificationCandidats: GetDonnéesPourPageNotificationCandidats =
  async ({ pagination, appelOffreId, periodeId, recherche, classement }) => {
    const projetsNonNotifiés = await models.Project.findAll({
      where: { notifiedOn: 0 },
      attributes: ['appelOffreId', 'periodeId'],
    })

    if (projetsNonNotifiés.length === 0) {
      return null
    }

    const listeAOs = projetsNonNotifiés.reduce(
      (acc, projet) =>
        acc.some((element) => element === projet.appelOffreId)
          ? acc
          : [...acc, projet.appelOffreId],
      []
    )

    const AOSélectionné = appelOffreId ?? listeAOs[0]

    const listePériodes = projetsNonNotifiés.reduce(
      (acc, projet) =>
        projet.appelOffreId === AOSélectionné &&
        !acc.some((element) => element === projet.periodeId)
          ? [...acc, projet.periodeId]
          : acc,
      []
    )

    const périodeSélectionnée = periodeId ?? listePériodes[0]

    const projetsPériodeSélectionnée = await listerProjetsNonNotifiés({
      pagination,
      filtres: {
        recherche,
        classement,
        appelOffre: {
          appelOffreId: AOSélectionné,
          periodeId: périodeSélectionnée,
        },
      },
    })

    if (projetsPériodeSélectionnée.itemCount === 0) {
      return null
    }

    return {
      listeAOs,
      AOSélectionné,
      listePériodes,
      périodeSélectionnée,
      projetsPériodeSélectionnée,
    }
  }
