import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

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
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      statut: 'validé',
      actuelles: {
        type,
        dateÉchéance,
        constitution: { date: dateConstitution, attestation },
        validéLe: modifiéLe,
      },
      dernièreMiseÀJour: {
        date: modifiéLe,
        par: modifiéPar,
      },
    },
  );
};
