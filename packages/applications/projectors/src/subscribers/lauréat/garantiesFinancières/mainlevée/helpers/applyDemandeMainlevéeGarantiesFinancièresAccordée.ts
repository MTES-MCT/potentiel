import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../../infrastructure/upsertProjection';

import { getMainlevéeDemandée } from './getMainlevéeDemandée';

export const applyDemandeMainlevéeGarantiesFinancièresAccordée = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent) => {
  const toUpsert = await getMainlevéeDemandée(identifiantProjet);

  if (toUpsert) {
    const data = {
      ...toUpsert,
      dernièreMiseÀJourLe: accordéLe,
      dernièreMiseÀJourPar: accordéPar,

      statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé.statut,

      accordéLe: accordéLe,
      accordéPar: accordéPar,
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
