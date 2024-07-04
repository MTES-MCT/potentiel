import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../../infrastructure/upsertProjection';

import { getMainlevéeDemandée } from './getMainlevéeDemandée';

export const applyDemandeMainlevéeGarantiesFinancièresRejetée = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent) => {
  const toUpsert = await getMainlevéeDemandée(identifiantProjet);

  if (toUpsert) {
    const data = {
      ...toUpsert,
      dernièreMiseÀJourLe: rejetéLe,
      dernièreMiseÀJourPar: rejetéPar,

      statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
      rejetéLe: rejetéLe,
      rejetéPar: rejetéPar,
      courrierRéponse: {
        format,
      },
    };

    await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${identifiantProjet}#${toUpsert.demandéLe}`,
      data,
    );
  }
};
