import { Request } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { ImportGestionnaireReseauPage } from '@views'
import { Tâches } from '@infra/sequelize/projectionsNext'

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.get(
    routes.IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    asyncHandler(async (request, response) => {
      const tâches = await Tâches.findAll({
        where: { type: 'maj-date-mise-en-service' },
        order: [['dateDeDébut', 'DESC']],
      })

      return response.send(
        ImportGestionnaireReseauPage({
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
          résultatSoumissionFormulaire: getFormResult(request, routes.IMPORT_GESTIONNAIRE_RESEAU),
        })
      )
    })
  )
}

const getFormResult = (request: Request, formId: string) => {
  const {
    session: { forms },
  } = request

  if (forms) {
    const { [formId]: form, ...clearedForms } = forms

    request.session.forms = clearedForms

    return form?.résultatSoumissionFormulaire
  }
}
