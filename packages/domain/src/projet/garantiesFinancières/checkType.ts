import { Option, isSome } from '@potentiel/monads';
import {
  TypeGarantiesFinancièresNonAcceptéErreur,
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
} from '../projet.error';
import {
  TypeGarantiesFinancières,
  estUnTypeDeGarantiesFinancièresAccepté,
} from '../projet.valueType';
import { Aggregate } from '@potentiel/core-domain';
import { Projet } from '../projet.aggregate';

export const checkType = (
  typeGarantiesFinancières: TypeGarantiesFinancières,
  currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts',
  agrégatProjet: Option<Aggregate & Projet>,
) => {
  if (!estUnTypeDeGarantiesFinancièresAccepté(typeGarantiesFinancières.type)) {
    throw new TypeGarantiesFinancièresNonAcceptéErreur();
  }

  if (typeGarantiesFinancières.dateÉchéance) {
    if (
      typeGarantiesFinancières.type !== `avec date d'échéance` &&
      typeGarantiesFinancières.type !== `type inconnu`
    )
      throw new DateÉchéanceGarantiesFinancièresNonAcceptéeErreur();
  }

  if (currentUserRôle === 'porteur-projet' && isSome(agrégatProjet)) {
    if (agrégatProjet.garantiesFinancières?.type) {
      throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
    }
  }
  return;
};
