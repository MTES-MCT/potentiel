import { Request } from 'express';

export const récupérerRésultatFormulaire = (request: Request, formId: string) => {
  const {
    session: { forms },
  } = request;

  if (forms) {
    const { [formId]: form, ...clearedForms } = forms;

    request.session.forms = clearedForms;

    return form?.résultatSoumissionFormulaire;
  }
};
