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

import { dbSchema } from '#helpers';

import { addGRDs, mapToRéférencielGRD, updateGRDs } from '#helpers/réseau';

const envSchema = z.object({
  ...dbSchema.shape,
  ORE_ENDPOINT: z.url(),
});

export class UpdateGestionnaires extends Command {
  static monitoringSlug = 'mise-a-jour-grd';

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
