import { Command } from '@oclif/core';
import { CommandError } from '@oclif/core/interfaces';
import { mediator } from 'mediateur';

import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { consulterCahierDesChargesChoisiAdapter } from '@potentiel-infrastructure/domain-adapters';
import { sendEmail } from '@potentiel-infrastructure/email';
import { killPool } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { registerRéseauQueries } from '@potentiel-domain/reseau';
import { registerLauréatQueries } from '@potentiel-domain/laureat';
import { registerUtilisateurQueries } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

export class NotifierGestionnaireRéseau extends Command {
  static description =
    'Envoyer un email de notification aux GRDs (sauf Enedis) ayant des dossiers de raccordement en attente de MES, pour les projets notifiés depuis 12 mois';

  async init() {
    registerRéseauQueries({
      list: listProjection,
      find: findProjection,
    });

    registerLauréatQueries({
      consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
      count: countProjection,
      find: findProjection,
      list: listProjection,
      récupérerIdentifiantsProjetParEmailPorteur: () => {
        throw new Error('récupérerIdentifiantsProjetParEmailPorteur not implemented');
      },
    });

    registerUtilisateurQueries({
      find: findProjection,
      list: listProjection,
      vérifierAccèsProjet: () => {
        throw new Error('vérifierAccèsProjet not implemented');
      },
    });
  }

  protected async catch(err: CommandError) {
    getLogger(NotifierGestionnaireRéseau.name).error(err);
  }

  async finally() {
    await killPool();
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

      const users = await mediator.send<ListerUtilisateursQuery>({
        type: 'Utilisateur.Query.ListerUtilisateurs',
        data: {
          identifiantGestionnaireRéseau: codeEIC,
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
