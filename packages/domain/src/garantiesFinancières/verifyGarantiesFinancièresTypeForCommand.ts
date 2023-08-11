import { Option, isSome } from '@potentiel/monads';
import { Aggregate } from '@potentiel/core-domain';
import {
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
  estUnTypeDeGarantiesFinancièresAccepté,
} from './garantiesFinancières.valueType';
import { Utilisateur, utilisateurEstPorteur } from '../domain.valueType';
import {
  DateÉchéanceGarantiesFinancièresNonAcceptéeErreur,
  DateÉchéanceGarantiesFinancièresRequiseErreur,
  ModificationGarantiesFinancièresNonAutoriséeErreur,
  TypeGarantiesFinancièresNonAcceptéErreur,
} from './garantiesFinancières.error';
import { GarantiesFinancièresAggregate } from './garantiesFinancières.aggregate';

export const verifyGarantiesFinancièresTypeForCommand = (
  typeGarantiesFinancières: TypeEtDateÉchéance['typeGarantiesFinancières'],
  dateÉchéance: TypeEtDateÉchéance['dateÉchéance'],
  utilisateur: Utilisateur,
  agrégatGarantiesFinancières?: Option<Aggregate & GarantiesFinancièresAggregate>,
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

  if (
    utilisateurEstPorteur(utilisateur) &&
    agrégatGarantiesFinancières &&
    isSome(agrégatGarantiesFinancières)
  ) {
    if ('typeGarantiesFinancières' in agrégatGarantiesFinancières.actuelles) {
      throw new ModificationGarantiesFinancièresNonAutoriséeErreur();
    }
  }
  return;
};
