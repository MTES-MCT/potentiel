import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { getLogger } from '@potentiel-libraries/monitoring';
import { createProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const seedPériodes = async () => {
  const logger = getLogger('seedPériodes');
  logger.info('Starting to seed Période referential data...');

  for (const appelOffre of appelsOffreData) {
    for (const période of appelOffre.periodes) {
      const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
        `${appelOffre.id}#${période.id}`,
      );
      const périodeEntity = await findProjection<Période.PériodeEntity>(
        `période|${identifiantPériode.formatter()}`,
      );
      if (Option.isSome(périodeEntity)) {
        continue;
      }
      logger.info(`Adding période ${identifiantPériode.formatter()}...`);

      await createProjection<Période.PériodeEntity>(`période|${identifiantPériode.formatter()}`, {
        identifiantPériode: identifiantPériode.formatter(),
        appelOffre: appelOffre.id,
        période: période.id,
        estNotifiée: false,
      });
    }
  }
};
