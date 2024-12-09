import { mediator } from 'mediateur';
import { Command, Flags } from '@oclif/core';

import { getKeycloakAdminClient, KeycloakAdmin } from '@potentiel-libraries/keycloak-cjs';
import { getLogger } from '@potentiel-libraries/monitoring';
import { GestionnaireRéseau, Raccordement, registerRéseauQueries } from '@potentiel-domain/reseau';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projections';
import { sendEmail } from '@potentiel-infrastructure/email';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

export default class NotifierGestionnairesRéseau extends Command {
  static override description =
    'Envoyer un email de notification aux GRDs ayant des dossiers de raccordement en attente de MES, pour les projets notifiés depuis `nbMoisDepuisNotification` mois';

  static override flags = {
    nbMoisDepuisNotification: Flags.integer({
      description:
        'Nombre de mois nécessaires depuis la désignation du projet. Les projets notifiés plus récemment sont ignorés',
      default: 12,
    }),
  };
  private logger = getLogger('ScheduledTasks.Raccordement.NotifierGestionnaireRéseau');

  public async run() {
    const { flags } = await this.parse(NotifierGestionnairesRéseau);

    registerRéseauQueries({
      list: listProjection,
      find: findProjection,
      count: countProjection,
    });

    this.logger.info('Lancement du script...');

    try {
      const gestionnaires = await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });
      const identifiantEnedis =
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType('17X100A100A0001A');

      for (const gestionnaire of gestionnaires.items) {
        // Enedis has automation, no need for a reminder
        if (gestionnaire.identifiantGestionnaireRéseau.estÉgaleÀ(identifiantEnedis)) {
          continue;
        }

        const dossiersRaccordement =
          await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
            type: 'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
            data: {
              identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.codeEIC,
              projetNotifiéAvant: DateTime.now()
                .ajouterNombreDeMois(flags.nbMoisNotification)
                .formatter(),
              // we don't use the result, no need to fetch all
              range: { startPosition: 0, endPosition: 1 },
            },
          });

        if (dossiersRaccordement.total === 0) {
          continue;
        }

        await this.sendEmail(gestionnaire);
      }

      this.logger.info('Fin du script ✨');
      process.exit(0);
    } catch (error) {
      this.logger.error(error as Error);
    }
  }

  #keycloakAdmin?: KeycloakAdmin;
  private async getKeycloakAdmin() {
    if (!this.#keycloakAdmin) {
      this.#keycloakAdmin = await getKeycloakAdminClient({
        clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
        clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
        realmName: process.env.KEYCLOAK_REALM!,
        serverUrl: process.env.KEYCLOAK_SERVER!,
      });
    }
    return this.#keycloakAdmin;
  }

  #grdGroupdIds?: Record<string, string>;
  async getGroupId(codeEIC: string): Promise<string | undefined> {
    if (!this.#grdGroupdIds) {
      const keycloakAdmin = await this.getKeycloakAdmin();
      const parents = await keycloakAdmin.groups.find({
        search: 'GestionnairesRéseau',
      });

      if (!parents[0]?.id) {
        return;
      }
      const groups = await keycloakAdmin.groups.listSubGroups({
        parentId: parents[0].id,
        max: 500,
      });
      this.#grdGroupdIds = groups.reduce(
        (prev, curr) => ({ ...prev, [curr.name!]: curr.id! }),
        {} as Record<string, string>,
      );
    }
    return this.#grdGroupdIds[codeEIC];
  }

  async sendEmail(gestionnaire: GestionnaireRéseau.GestionnaireRéseauListItemReadModel) {
    const keycloakAdmin = await this.getKeycloakAdmin();
    const codeEIC = gestionnaire.identifiantGestionnaireRéseau.codeEIC;
    const groupId = await this.getGroupId(codeEIC);
    if (!groupId) {
      this.logger.warn(`Group ID not found for ${gestionnaire.raisonSociale} (${codeEIC})`);
      return [];
    }

    const recipients = (await keycloakAdmin.groups.listMembers({ id: groupId }))
      .map((u) => ({
        email: u.email ?? '',
        fullName: u.lastName ?? '',
      }))
      .filter((u) => !!u.email);

    if (recipients.length === 0) {
      this.logger.warn(`No recipient found for ${gestionnaire.raisonSociale} (${codeEIC})`);
      return;
    }
    await sendEmail({
      templateId: 6540182,
      messageSubject: `Potentiel - Des dossiers de raccordement sont en attente de mise en service`,
      recipients,
      variables: {
        url: Routes.Raccordement.lister,
      },
    });
    this.logger.info(`Email sent for ${gestionnaire.raisonSociale} (${codeEIC})`);
  }
}
