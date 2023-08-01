import { Option, isSome } from '@potentiel/monads';
import {
  TypeGarantiesFinancièresNonAcceptéErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
} from '../projet.error';
import { Aggregate } from '@potentiel/core-domain';
import { Projet } from '../projet.aggregate';
import {
  TypeEtDateÉchéance,
  estUnTypeDeGarantiesFinancièresAccepté,
} from './garantiesFinancières.valueType';
import { Utilisateur, utilisateurEstPorteur } from '../../domain.valueType';

export const verifyGarantiesFinancièresTypeForCommand = (
  typeGarantiesFinancières: TypeEtDateÉchéance['typeGarantiesFinancières'],
  dateÉchéance: TypeEtDateÉchéance['dateÉchéance'],
  utilisateur: Utilisateur,
  agrégatProjet: Option<Aggregate & Projet>,
) => {
  if (!estUnTypeDeGarantiesFinancièresAccepté(typeGarantiesFinancières)) {
    throw new TypeGarantiesFinancièresNonAcceptéErreur();
  }

  if (dateÉchéance) {
    if (
      typeGarantiesFinancières !== `avec date d'échéance` &&
      typeGarantiesFinancières !== `type inconnu`
    )
      throw new DateÉchéanceGarantiesFinancièresNonAcceptéeErreur();
  }

  if (utilisateurEstPorteur(utilisateur) && isSome(agrégatProjet)) {
    if (agrégatProjet.garantiesFinancières?.typeGarantiesFinancières) {
      throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
    }
  }
  return;
};
