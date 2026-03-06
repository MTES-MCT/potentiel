import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresModifiéesProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    attestation,
    dateConstitution,
    modifiéLe,
    modifiéPar,
  },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent) => {
  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      garantiesFinancières: {
        statut: 'validé',
        type,
        dateÉchéance,
        dateConstitution,
        attestation,
        dernièreMiseÀJour: {
          date: modifiéLe,
          par: modifiéPar,
        },
      },
    },
  );
};
