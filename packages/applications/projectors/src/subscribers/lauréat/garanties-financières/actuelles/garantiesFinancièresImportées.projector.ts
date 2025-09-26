import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresImportéesProjector = async ({
  payload: { identifiantProjet, type, dateÉchéance, attestation, dateConstitution, importéLe },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresImportéesEvent) => {
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
          date: importéLe,
        },
      },
    },
  );

  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
