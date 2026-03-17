import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationGarantiesFinancièresEnregistréeProjector = async ({
  payload: { identifiantProjet, attestation, dateConstitution, enregistréLe, enregistréPar },
}: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent) => {
  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      statut: 'validé',
      actuelles: {
        constitution: {
          date: dateConstitution,
          attestation,
        },
      },
      enAttente: {
        motif: undefined,
        dateLimiteSoumission: undefined,
      },
      dernièreMiseÀJour: {
        par: enregistréPar,
        date: enregistréLe,
      },
    },
  );
};
