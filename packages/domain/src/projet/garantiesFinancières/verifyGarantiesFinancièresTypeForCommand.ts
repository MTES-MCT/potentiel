import { Option, isSome } from '@potentiel/monads';
import { Aggregate } from '@potentiel/core-domain';
import { Projet } from '../projet.aggregate';
import {
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
  estUnTypeDeGarantiesFinancièresAccepté,
} from '../../garantiesFinancières/garantiesFinancières.valueType';
import { Utilisateur, utilisateurEstPorteur } from '../../domain.valueType';
import {
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
  TypeGarantiesFinancièresNonAcceptéErreur,
} from '../../garantiesFinancières/garantiesFinancières.error';

export const verifyGarantiesFinancièresTypeForCommand = (
  typeGarantiesFinancières: TypeEtDateÉchéance['typeGarantiesFinancières'],
  dateÉchéance: TypeEtDateÉchéance['dateÉchéance'],
  utilisateur: Utilisateur,
  agrégatProjet?: Option<Aggregate & Projet>,
) => {
  if (!estUnTypeDeGarantiesFinancièresAccepté(typeGarantiesFinancières)) {
    throw new TypeGarantiesFinancièresNonAcceptéErreur();
  }

  if (dateÉchéance && !estTypeAvecDateÉchéance(typeGarantiesFinancières)) {
    throw new DateÉchéanceGarantiesFinancièresNonAcceptéeErreur();
  }

  if (estTypeAvecDateÉchéance(typeGarantiesFinancières) && !dateÉchéance) {
    throw new DateÉchéanceGarantiesFinancièresRequiseErreur();
  }

  if (utilisateurEstPorteur(utilisateur) && agrégatProjet && isSome(agrégatProjet)) {
    if (agrégatProjet.garantiesFinancières?.typeGarantiesFinancières) {
      throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
    }
  }
  return;
};
