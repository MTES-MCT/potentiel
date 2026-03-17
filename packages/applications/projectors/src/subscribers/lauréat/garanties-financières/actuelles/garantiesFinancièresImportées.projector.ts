import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresImportéesProjector = async ({
  payload: { identifiantProjet, type, dateÉchéance, attestation, dateConstitution, importéLe },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresImportéesEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: 'validé',
      actuelles: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        constitution: {
          date: dateConstitution,
          attestation,
        },
      }).formatter(),
      dernièreMiseÀJour: {
        date: importéLe,
      },
    },
  );
};
