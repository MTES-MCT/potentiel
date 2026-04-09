import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

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
        }).formatter(),
        constitution: {
          date: dateConstitution,
          attestation,
        },
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
      },
    },
  );
};
