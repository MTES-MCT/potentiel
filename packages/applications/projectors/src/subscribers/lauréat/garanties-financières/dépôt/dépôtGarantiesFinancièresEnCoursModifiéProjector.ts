import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dépôtGarantiesFinancièresEnCoursModifiéProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    dateConstitution,
    attestation,
    modifiéLe,
    modifiéPar,
  },
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      dépôt: {
        type,
        dateConstitution,
        attestation,
        dateÉchéance,
        dernièreMiseÀJour: {
          date: modifiéLe,
          par: modifiéPar,
        },
      },
    },
  );
};
