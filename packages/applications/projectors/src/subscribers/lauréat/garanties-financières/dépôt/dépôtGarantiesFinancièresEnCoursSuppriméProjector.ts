import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const dépôtGarantiesFinancièresEnCoursSuppriméProjector = async ({
  payload: { identifiantProjet },
}:
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent) => {
  const existingProjection =
    await findProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
    );

  if (Option.isNone(existingProjection) || !existingProjection.dépôt) {
    throw new Error('Pas de dépôt en cours de garanties financières à supprimer');
  }

  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      ...existingProjection,
      dépôt: undefined,
    },
  );
};
