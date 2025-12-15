import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { InvalidOperationError } from '@potentiel-domain/core';

import { récuperérerGarantiesFinancièresActuelles } from './récupérerGarantiesFinancièresActuelles';

export const vérifierProjetNonExemptDeGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const garantiesFinancièresActuelles = await récuperérerGarantiesFinancièresActuelles(
    identifiantProjet.formatter(),
  );

  if (
    Option.isSome(garantiesFinancièresActuelles) &&
    garantiesFinancièresActuelles.garantiesFinancières.type.estExemption()
  ) {
    throw new InvalidOperationError('Le projet est exempt de garanties financières.');
  }
};
