import { RésultatSoumissionFormulaire } from 'express-session'
import { Request } from 'express'

export const sauvegarderRésultatFormulaire = (
  request: Request,
  formId: string,
  formResult: RésultatSoumissionFormulaire | undefined
) => {
  const form = request.session.forms?.[formId]

  request.session.forms = {
    ...request.session.forms,
    [formId]: {
      ...form,
      résultatSoumissionFormulaire: formResult,
    },
  }
}
