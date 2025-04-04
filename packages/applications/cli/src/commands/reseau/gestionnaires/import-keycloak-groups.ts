import { Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import { z } from 'zod';

import { getKeycloakAdminClient } from '@potentiel-libraries/keycloak-cjs';
import { GestionnaireRéseau, registerRéseauQueries } from '@potentiel-domain/reseau';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { registerLauréatQueries } from '@potentiel-domain/laureat';
import {
  consulterCahierDesChargesChoisiAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';

const configSchema = z.object({
  KEYCLOAK_SERVER: z.string().url(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_ADMIN_CLIENT_ID: z.string(),
  KEYCLOAK_ADMIN_CLIENT_SECRET: z.string(),
});

export default class SyncKeycloakGroups extends Command {
  static override description = 'Crée les groupes de gestionnaires réseau manquants dans Keycloak';

  static override args = {};

  static override flags = {
    dryRun: Flags.boolean({
      default: false,
      description: 'Exécution test, sans mise à jour',
    }),
  };

  public async init() {
    registerRéseauQueries({
      find: findProjection,
      list: listProjection,
    });

    registerLauréatQueries({
      find: findProjection,
      list: listProjection,
      count: countProjection,
      récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
      consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
    });
  }

  public async run(): Promise<void> {
    console.info('Lancement du script...');
    const { flags } = await this.parse(SyncKeycloakGroups);

    const config = configSchema.parse(process.env);

    let added = 0;
    const updated = 0;
    let upToDate = 0;

    const gestionnaires = await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      data: {},
    });

    console.log(`${gestionnaires.total} gestionnaires trouvés`);

    const keycloakAdmin = await getKeycloakAdminClient({
      clientId: config.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: config.KEYCLOAK_ADMIN_CLIENT_SECRET,
      realmName: config.KEYCLOAK_REALM,
      serverUrl: config.KEYCLOAK_SERVER,
    });

    const parentGroup = (await keycloakAdmin.groups.find({ search: 'GestionnairesRéseau' }))[0];
    if (!parentGroup?.id) {
      console.log("Le groupe GestionnairesRéseau n'existe pas");
      process.exit(1);
    }
    const groups = await keycloakAdmin.groups.listSubGroups({ parentId: parentGroup.id, max: 500 });

    for (const grd of gestionnaires.items) {
      try {
        const group = groups.find((g) => g.name === grd.identifiantGestionnaireRéseau.codeEIC);
        if (group) {
          upToDate++;
          continue;
        }

        if (flags.dryRun) {
          console.log(`[dry-run] Create group ${grd.identifiantGestionnaireRéseau.codeEIC}`);
        } else {
          console.log(`Create group ${grd.identifiantGestionnaireRéseau.codeEIC}`);

          await keycloakAdmin.groups.createChildGroup(
            { id: parentGroup.id },
            { name: grd.identifiantGestionnaireRéseau.codeEIC },
          );
        }
        added++;
      } catch (e) {
        console.log(e);
      }
    }

    console.log(`${added} groupes créés, ${updated} mis à jour, ${upToDate} déjà à jour`);
    console.info('Fin du script ✨');

    process.exit(0);
  }
}
