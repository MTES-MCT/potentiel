import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
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
  await upsertProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
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

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        dateLimiteSoumission: undefined,
        motifEnAttente: undefined,
      },
    },
  );
};
