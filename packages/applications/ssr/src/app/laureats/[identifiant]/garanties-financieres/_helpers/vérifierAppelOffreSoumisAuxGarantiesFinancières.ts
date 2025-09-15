import { IdentifiantProjet } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

import { getCahierDesCharges } from '@/app/_helpers';

export const vérifierProjetSoumisAuxGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  if (!cahierDesCharges.estSoumisAuxGarantiesFinancières()) {
    throw new InvalidOperationError(`Le projet n'est pas soumis aux garanties financières.`);
  }
};
