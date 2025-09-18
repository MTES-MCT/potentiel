import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

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
  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
