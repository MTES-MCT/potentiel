import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

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
  await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      dépôt: {
        type,
        dateÉchéance,
        dateConstitution,
        attestation,
        soumisLe,
        dernièreMiseÀJour: {
          date: soumisLe,
          par: soumisPar,
        },
      },
    },
  );
};
