import { GetLauréat } from '@/app/laureats/[identifiant]/_helpers';

export const vérifierSiModificationRaccordementPossible = (lauréat: GetLauréat): boolean =>
  lauréat.powerPurchaseAgreement
    ? true
    : lauréat.lauréat.statut.estAbandonné() || lauréat.abandon?.demandeEnCours
      ? false
      : true;
