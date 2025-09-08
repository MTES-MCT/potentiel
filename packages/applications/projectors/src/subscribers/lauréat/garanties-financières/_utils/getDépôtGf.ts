import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getDépôtGf = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const dépôtExistant =
    await findProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    );

  return Option.isSome(dépôtExistant) ? dépôtExistant : undefined;
};
