import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { type GetLauréat, getLauréat } from '@/app/laureats/[identifiant]/_helpers';

export const returnLauréatSiModificationRaccordementAccessibleSinonRedirect = async (
  identifiantProjet: IdentifiantProjet.RawType,
) => {
  const lauréat = await getLauréat(identifiantProjet);
  const peutModifierRaccordement = vérifierSiModificationRaccordementPossible(lauréat);
  if (!peutModifierRaccordement) {
    return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
  }
  return lauréat;
};

export const vérifierSiModificationRaccordementPossible = (lauréat: GetLauréat): boolean =>
  lauréat.powerPurchaseAgreement
    ? true
    : !lauréat.lauréat.statut.estAbandonné() && !lauréat.abandon?.demandeEnCours;
