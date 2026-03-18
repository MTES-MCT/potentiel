import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresÉchuesProjector = async ({
  payload: { identifiantProjet, échuLe },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      statut: 'échu',
      dernièreMiseÀJour: {
        date: échuLe,
      },
    },
  );
};
