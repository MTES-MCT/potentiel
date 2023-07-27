import { Option, isSome } from '@potentiel/monads';
import {
  TypeGarantiesFinancièresNonAcceptéErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
} from '../projet.error';
import { TypeEtDateÉchéance, estUnTypeDeGarantiesFinancièresAccepté } from '../projet.valueType';
import { Aggregate } from '@potentiel/core-domain';
import { Projet } from '../projet.aggregate';

export const checkType = (
  typeGarantiesFinancières: TypeEtDateÉchéance['typeGarantiesFinancières'],
  dateÉchéance: TypeEtDateÉchéance['dateÉchéance'],
  currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts',
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

  if (currentUserRôle === 'porteur-projet' && isSome(agrégatProjet)) {
    if (agrégatProjet.garantiesFinancières?.typeGarantiesFinancières) {
      throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
    }
  }
  return;
};
