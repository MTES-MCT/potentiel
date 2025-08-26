import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getGfActuelles = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const garantiesFinancières =
    await findProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
    );

  return Option.isSome(garantiesFinancières) ? garantiesFinancières : undefined;
};
