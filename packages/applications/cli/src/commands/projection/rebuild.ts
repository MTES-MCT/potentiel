import { Args, Command, getLogger } from '@oclif/core';

import { executeQuery } from '@potentiel-libraries/pg-helpers';

export class RebuildProjectionCommand extends Command {
  description = 'Déclancher le rebuild des projections';
  static args = {
    categoryOuStreamId: Args.string({
      description: 'nom de la catégorie ou du stream à rebuild',
      required: true,
    }),
  };

  async run() {
    const { args } = await this.parse(RebuildProjectionCommand);
    const { categoryOuStreamId } = args;
    const [category, streamId] = categoryOuStreamId.split('|');
    await executeQuery(`call event_store.rebuild($1, $2)`, category, streamId);
    getLogger().info('Rebuild triggered');
  }
}
