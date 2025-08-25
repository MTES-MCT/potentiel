import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dépôtGarantiesFinancièresEnCoursSuppriméProjector = async ({
  payload: { identifiantProjet },
}:
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent) => {
  await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
