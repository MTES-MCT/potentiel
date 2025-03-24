import { mediator } from 'mediateur';

import { getKeycloakAdminClient } from '@potentiel-libraries/keycloak-cjs';
import { getLogger } from '@potentiel-libraries/monitoring';
import { GestionnaireRéseau, registerRéseauQueries } from '@potentiel-domain/reseau';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { sendEmail } from '@potentiel-infrastructure/email';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Raccordement, registerLauréatQueries } from '@potentiel-domain/laureat';
import {
  consulterCahierDesChargesChoisiAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';

registerRéseauQueries({
  list: listProjection,
  find: findProjection,
});

registerLauréatQueries({
  consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
  count: countProjection,
  find: findProjection,
  list: listProjection,
  récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
});

// Envoyer un email de notification aux GRDs ayant des dossiers de raccordement en attente de MES, pour les projets notifiés depuis 12 mois
void (async () => {
  const logger = getLogger();

  logger.info('Lancement du script...');

  try {
    const keycloakAdmin = await getKeycloakAdminClient({
      clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
      realmName: process.env.KEYCLOAK_REALM!,
      serverUrl: process.env.KEYCLOAK_SERVER!,
    });

    const parentGroups = await keycloakAdmin.groups.find({
      search: 'GestionnairesRéseau',
    });

    if (!parentGroups[0]?.id) {
      logger.warn('Parent group GestionnairesRéseau not found');
      process.exit(1);
    }
    const groups = await keycloakAdmin.groups.listSubGroups({
      parentId: parentGroups[0].id,
      max: 500,
    });
    const grdGroupdIds = groups.reduce(
      (prev, curr) => ({ ...prev, [curr.name!]: curr.id! }),
      {} as Record<string, string>,
    );

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

      const codeEIC = gestionnaire.identifiantGestionnaireRéseau.codeEIC;
      const groupId = grdGroupdIds[codeEIC];
      if (!groupId) {
        logger.warn(`Group ID not found for ${gestionnaire.raisonSociale} (${codeEIC})`);
        return [];
      }

      const dossiersRaccordement =
        await mediator.send<Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>({
          type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
          data: {
            identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.codeEIC,
            projetNotifiéAvant: DateTime.now().ajouterNombreDeMois(12).formatter(),
            // we don't use the result, no need to fetch all
            range: { startPosition: 0, endPosition: 1 },
          },
        });

      if (dossiersRaccordement.total === 0) {
        continue;
      }

      const recipients = (await keycloakAdmin.groups.listMembers({ id: groupId }))
        .map((u) => ({
          email: u.email ?? '',
        }))
        .filter((u) => !!u.email);

      if (recipients.length === 0) {
        logger.warn(`No recipient found for ${gestionnaire.raisonSociale} (${codeEIC})`);
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
      logger.info(`Email sent for ${gestionnaire.raisonSociale} (${codeEIC})`);
    }

    logger.info('Fin du script ✨');
    process.exit(0);
  } catch (error) {
    logger.error(error as Error);
  }
})();
