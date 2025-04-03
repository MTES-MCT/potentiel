import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const projetSoumisAuxGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const { appelOffres, famille } = await getPériodeAppelOffres(identifiantProjet);

  return famille
    ? famille.soumisAuxGarantiesFinancieres !== 'non soumis'
    : appelOffres.soumisAuxGarantiesFinancieres !== 'non soumis';
};
