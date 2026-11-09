import { Command, Flags } from '@oclif/core';

import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

export class SupprimerSubscriber extends Command {
  static flags = {
    category: Flags.string({
      char: 'c',
      description: 'le stream category du subscriber',
      required: true,
    }),
    name: Flags.string({
      char: 'n',
      description: 'le nom du subscriber',
      required: true,
    }),
  };

  async init() {
    dbSchema.parse(process.env);
  }

  async run() {
    const {
      flags: { category, name },
    } = await this.parse(SupprimerSubscriber);

    try {
      const { rowCount } = await executeQuery(
        `
        DELETE FROM event_store.subscriber
        WHERE stream_category=$1 AND subscriber_name=$2;`,
        category,
        name,
      );

      if (!rowCount) {
        this.error(`❌ Aucun subscriber ${category} (${name}) trouvé`);
      }

      this.log(
        [
          `✅ Le subscriber ${category} (${name}) a bien été supprimé`,
          `⚠️ Une fois votre traitement effectué, pensez bien à redémarrer l'application cible pour que le subscriber soit recréé. Cette requête SQL devrait alors renvoyer un résultat :`,
          '',
          `  SELECT * FROM event_store.subscriber WHERE stream_category = '${category}' AND subscriber_name = '${name}';`,
        ].join('\n'),
      );

      process.exit(0);
    } catch (error) {
      this.error(`❌ Une erreur est survenue : ${(error as Error).message}`);
    }
  }
}
