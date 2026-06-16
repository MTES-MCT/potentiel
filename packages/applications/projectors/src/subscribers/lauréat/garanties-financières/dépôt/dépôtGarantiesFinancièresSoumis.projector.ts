import { Lauréat } from '@potentiel-domain/projet';
import {
  type DeepUndefined,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const dépôtGarantiesFinancièresSoumisProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    dateConstitution,
    attestation,
    soumisLe,
    soumisPar,
  },
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      dépôt: {
        ...Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
          type,
          dateÉchéance,
          constitution: {
            date: dateConstitution,
            attestation,
          },
        }).formatter(),
        soumisLe,
        soumisPar,
        dernièreMiseÀJour: {
          date: soumisLe,
          par: soumisPar,
        },
      },
      enAttente: {
        dateLimiteSoumission: undefined,
        motif: undefined,
      } satisfies DeepUndefined<
        Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['enAttente']
      >,
    },
  );
};
