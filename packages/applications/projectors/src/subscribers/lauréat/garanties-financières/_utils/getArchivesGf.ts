import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getArchivesGf = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const archivesGf =
    await findProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet}`,
    );

  return Option.isSome(archivesGf) ? archivesGf : undefined;
};
