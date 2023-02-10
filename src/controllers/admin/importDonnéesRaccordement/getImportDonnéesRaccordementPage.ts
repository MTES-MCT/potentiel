import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { ImportDonneesRaccordementPage } from '@views'
import { Tâches } from '@infra/sequelize/projectionsNext'
import { récupérerRésultatFormulaire } from '../../helpers/formulaires'

v1Router.get(
  routes.IMPORT_DONNEES_RACCORDEMENT,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const tâches = await Tâches.findAll({
      where: { type: 'maj-données-de-raccordement' },
      order: [['dateDeDébut', 'DESC']],
    })

    return response.send(
      ImportDonneesRaccordementPage({
        request,
        tâches: tâches.map((tâche) => {
          const { dateDeDébut, type, état, résultat } = tâche

          return {
            type,
            dateDeDébut,
            ...(état === 'en cours'
              ? {
                  état: 'en cours',
                }
              : {
                  état: 'terminée',
                  dateDeFin: tâche.dateDeFin!,
                  détail: résultat || {},
                }),
          }
        }),
        résultatSoumissionFormulaire: récupérerRésultatFormulaire(
          request,
          routes.IMPORT_DONNEES_RACCORDEMENT
        ),
      })
    )
  })
)
