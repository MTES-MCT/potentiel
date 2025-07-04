import { mediator } from 'mediateur';
import { Command } from '@oclif/core';
import z from 'zod';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';
import { récupérerTousLesGRD } from '@potentiel-infrastructure/ore-client';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

import { addGRDs } from '../../helpers/réseau/addGRDs';
import { updateGRDs } from '../../helpers/réseau/updateGRDs';
import { mapToRéférencielGRD } from '../../helpers/réseau/référencielGRD';
import { getHealthcheckClient, HealthcheckClient } from '../../helpers/healthcheck';

const envSchema = z.object({
  ORE_ENDPOINT: z.string().url(),
  DATABASE_CONNECTION_STRING: z.string().url(),
  SENTRY_CRONS: z.string().optional(),
  APPLICATION_STAGE: z.string(),
});

export class UpdateGestionnaires extends Command {
  private healthcheckClient?: HealthcheckClient;
  static monitoringSlug = 'mise-a-jour-grd';

  async init() {
    const config = envSchema.parse(process.env);
    registerRéseauUseCases({
      loadAggregate: loadAggregateV2,
    });

    registerRéseauQueries({
      list: listProjection,
      find: findProjection,
    });

    this.healthcheckClient = getHealthcheckClient({
      healthcheckUrl: config.SENTRY_CRONS,
      slug: UpdateGestionnaires.monitoringSlug,
      environment: config.APPLICATION_STAGE,
    });

    await this.healthcheckClient.start();
  }

  async finally(error: Error | undefined) {
    if (error) {
      await this.healthcheckClient?.error();
    } else {
      await this?.healthcheckClient?.success();
    }
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
