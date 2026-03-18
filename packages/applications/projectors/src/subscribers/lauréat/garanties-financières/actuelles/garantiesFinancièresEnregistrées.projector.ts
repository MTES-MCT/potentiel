import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

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
  version,
}: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent & Event) => {
  const actuelles = Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
    type,
    dateÉchéance,
    constitution: {
      date: dateConstitution,
      attestation,
    },
  }).formatter();

  const dernièreMiseÀJour = { date: enregistréLe, par: enregistréPar };

  if (version === 1) {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        statut: 'validé',
        actuelles,
        dernièreMiseÀJour,
        archives: [],
      },
    );
  } else {
    await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        statut: 'validé',
        actuelles,
        dernièreMiseÀJour,
        enAttente: {
          dateLimiteSoumission: undefined,
          motif: undefined,
        },
      },
    );
  }
};
