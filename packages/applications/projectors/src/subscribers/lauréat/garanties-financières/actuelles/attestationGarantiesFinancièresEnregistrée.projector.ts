import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationGarantiesFinancièresEnregistréeProjector = async ({
  payload: { identifiantProjet, attestation, dateConstitution, enregistréLe, enregistréPar },
}: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        statut: 'validé',
        dateConstitution,
        attestation,
        dernièreMiseÀJour: {
          par: enregistréPar,
          date: enregistréLe,
        },
        motifEnAttente: undefined,
        dateLimiteSoumission: undefined,
      },
    },
  );
};
