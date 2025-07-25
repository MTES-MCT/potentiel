import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getPériodeAppelOffres } from '@/app/_helpers';

export const projetSoumisAuxGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const { appelOffres, famille } = await getPériodeAppelOffres(identifiantProjet);

  return famille
    ? famille.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis'
    : appelOffres.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis';
};
