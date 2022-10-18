import { Request } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { ImportGestionnaireReseauPage } from '@views'

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.get(
    routes.IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    asyncHandler(async (request, response) => {
      return response.send(
        ImportGestionnaireReseauPage({
          request,
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
