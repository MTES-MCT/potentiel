import { Lauréat } from '@potentiel-domain/projet';
import { DeepUndefined, updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dépôtGarantiesFinancièresEnCoursSuppriméProjector = async ({
  payload: { identifiantProjet },
}:
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      dépôt: {
        constitution: {
          date: undefined,
          attestation: {
            format: undefined,
          },
        },
        dateÉchéance: undefined,
        soumisLe: undefined,
        soumisPar: undefined,
        dernièreMiseÀJour: {
          date: undefined,
          par: undefined,
        },
        type: undefined,
      } satisfies DeepUndefined<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['dépôt']>,
    },
  );
};
