import { Request } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { ImportGestionnaireReseauPage } from '@views'
import { Tâches } from '@infra/sequelize/projectionsNext'
import { RésultatTâcheMaJMeS } from '@modules/imports/gestionnaireRéseau'

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
          tâches: tâches.map((t) => {
            const { dateDeDébut, type, état, résultat } = t

            return {
              type,
              dateDeDébut,
              ...(état === 'en cours'
                ? {
                    état: 'en cours',
                  }
                : {
                    état: 'terminée',
                    dateDeFin: t.dateDeFin!,
                    nombreDeSucces: t.nombreDeSucces!,
                    nombreDEchecs: t.nombreDEchecs!,
                    résultatErreurs: getRésultatErreurs(résultat!),
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

const getRésultatErreurs = (résultat: RésultatTâcheMaJMeS) => {
  type RésultatEchecs = {
    raison: string
    projetId?: string
    identifiantGestionnaireRéseau: string
    état: 'échec'
  }

  return résultat
    .filter((r): r is RésultatEchecs => r.état === 'échec')
    .map(({ raison, projetId, identifiantGestionnaireRéseau }) => ({
      raison,
      ...(projetId && { projetId }),
      identifiantGestionnaireRéseau,
    }))
}
