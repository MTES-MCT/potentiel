import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresEnregistréesProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    attestation,
    dateConstitution,
    enregistréLe,
    enregistréPar,
  },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent) => {
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
          date: enregistréLe,
          par: enregistréPar,
        },
        dateLimiteSoumission: undefined,
        motifEnAttente: undefined,
      },
    },
  );
};
