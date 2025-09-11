import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresEnregistréesProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    dateDélibération,
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
        dateDélibération,
        dateConstitution,
        attestation,
        dernièreMiseÀJour: {
          date: enregistréLe,
          par: enregistréPar,
        },
      },
    },
  );

  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
