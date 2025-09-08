import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { sendEmail } from '@potentiel-infrastructure/email';
import { getLogger } from '@potentiel-libraries/monitoring';
import { registerRéseauQueries } from '@potentiel-domain/reseau';
import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat, registerProjetQueries } from '@potentiel-domain/projet';

export class NotifierGestionnaireRéseau extends Command {
  static monitoringSlug = 'notification-grd';

  static description =
    'Envoyer un email de notification aux GRDs (sauf Enedis) ayant des dossiers de raccordement en attente de MES, pour les projets notifiés depuis 12 mois';

  async init() {
    registerRéseauQueries({
      list: listProjection,
      find: findProjection,
    });

    registerProjetQueries({
      list: listProjection,
      count: countProjection,
      find: findProjection,
      listHistory: listHistoryProjection,
      récupérerProjetsEligiblesPreuveRecanditure: () => {
        throw new Error('not implemented');
      },
      consulterABénéficiéDuDélaiCDC2022: () => {
        throw new Error('not implemented');
      },
      getScopeProjetUtilisateur: () => {
        throw new Error('not implemented');
      },
      récupérerIdentifiantsProjetParEmailPorteur: () => {
        throw new Error('not implemented');
      },
    });

    registerUtilisateurQueries({
      find: findProjection,
      list: listProjection,
    });
  }

  async run() {
    const logger = getLogger(NotifierGestionnaireRéseau.name);
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

      const dossiersRaccordement =
        await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>(
          {
            type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
            data: {
              identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.codeEIC,
              projetNotifiéAvant: DateTime.now().ajouterNombreDeMois(12).formatter(),
              // we don't use the result, no need to fetch all
              range: { startPosition: 0, endPosition: 1 },
            },
          },
        );

      if (dossiersRaccordement.total === 0) {
        continue;
      }

      const users = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          identifiantGestionnaireRéseau: codeEIC,
          actif: true,
        },
      });

      const recipients = users.items.map(({ identifiantUtilisateur: { email } }) => ({ email }));

      if (recipients.length === 0) {
        logger.warn(`No recipient found for ${gestionnaire.raisonSociale} (${codeEIC})`);
        continue;
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
  }
}
