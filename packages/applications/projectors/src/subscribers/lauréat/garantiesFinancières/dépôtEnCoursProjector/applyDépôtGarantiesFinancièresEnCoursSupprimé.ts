import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../../infrastructure/removeProjection';

export const applyDépôtGarantiesFinancièresEnCoursSupprimé = async (
  identifiantProjet: IdentifiantProjet.RawType,
) => {
  await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
