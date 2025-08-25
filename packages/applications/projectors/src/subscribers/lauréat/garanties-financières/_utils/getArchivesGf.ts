import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getArchivesGf = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const archivesGf = await findProjection<GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
    `archives-garanties-financieres|${identifiantProjet}`,
  );

  return Option.isSome(archivesGf) ? archivesGf : undefined;
};
