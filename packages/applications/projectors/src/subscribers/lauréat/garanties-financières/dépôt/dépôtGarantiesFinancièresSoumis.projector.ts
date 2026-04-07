import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
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
  version,
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent & Event) => {
  const dépôt: Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['dépôt'] = {
    ...Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
      type,
      dateÉchéance,
      constitution: {
        date: dateConstitution,
        attestation,
      },
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
  };

  if (version === 1) {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        statut: 'non-déposé',
        archives: [],
        dernièreMiseÀJour: {
          date: soumisLe,
          par: soumisPar,
        },
        dépôt,
      },
    );
    return;
  }

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      dépôt,
    },
  );
};
