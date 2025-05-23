import { mediator } from 'mediateur';
import { Command } from '@oclif/core';
import z from 'zod';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { récupérerTousLesGRD } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';
import { killPool } from '@potentiel-libraries/pg-helpers';

import { addGRDs } from '../../helpers/réseau/addGRDs';
import { updateGRDs } from '../../helpers/réseau/updateGRDs';
import { mapToRéférencielGRD } from '../../helpers/réseau/référencielGRD';

const envSchema = z.object({
  ORE_ENDPOINT: z.string().url(),
  DATABASE_CONNECTION_STRING: z.string().url(),
});

export class UpdateGestionnaires extends Command {
  async init() {
    envSchema.parse(process.env);
    registerRéseauUseCases({
      loadAggregate,
    });

    registerRéseauQueries({
      list: listProjection,
      find: findProjection,
    });
  }

  protected async finally(error: Error | undefined) {
    if (error) {
      getLogger().error(error as Error);
    }
    await killPool();
  }

  async run() {
    getLogger().info('Import des GRDs...');

    const gestionnairesFromORE = await récupérerTousLesGRD();

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const { àAjouter, àModifier } = mapToRéférencielGRD(gestionnairesFromORE, gestionnairesRéseau);

    await addGRDs(àAjouter);

    await updateGRDs(àModifier);

    getLogger().info('Fin du script ✨');
  }
}
