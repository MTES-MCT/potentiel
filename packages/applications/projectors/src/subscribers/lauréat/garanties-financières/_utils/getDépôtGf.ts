import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getDépôtGf = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const dépôtExistant =
    await findProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    );

  return Option.isSome(dépôtExistant) ? dépôtExistant : undefined;
};
