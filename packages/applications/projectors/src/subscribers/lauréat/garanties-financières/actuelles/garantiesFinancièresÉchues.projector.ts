import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresÉchuesProjector = async ({
  payload: { identifiantProjet, échuLe },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent) => {
  await updateOneProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        statut: 'échu',
        dernièreMiseÀJour: {
          date: échuLe,
        },
      },
    },
  );
};
