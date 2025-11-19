import { Routes } from '@potentiel-applications/routes';

import { getProjetÉliminé } from '@/app/elimines/[identifiant]/_helpers/getÉliminé';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

export default async function ProjetPage({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = decodeParameter(identifiant);
  const éliminé = await getProjetÉliminé(identifiantProjet);

  if (éliminé) {
    return Routes.Éliminé.détails(identifiantProjet);
  }

  return Routes.Projet.details(identifiantProjet);
}
