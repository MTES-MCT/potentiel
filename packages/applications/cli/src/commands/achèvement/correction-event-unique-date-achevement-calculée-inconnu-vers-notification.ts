import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';
import {
  déplacerEventEnPremierEtTransformerEnNotification,
  ECART_JOURS,
  getDonnéesCorrectes,
  transformerEventInconnuEnEventNotification,
} from '#helpers/achèvement';

const envSchema = z.object({
  ...dbSchema.shape,
});

type LigneSuccès = {
  identifiantProjet: IdentifiantProjet.RawType;
  datePrévisionnelleActuelle: DateTime.RawType;
  datePrévisionnelleCorrecte: DateTime.RawType;
  écartJours: number;
  opération: 'transformation' | 'déplacement + transformation';
};

type LigneErreurÉcart = {
  identifiantProjet: IdentifiantProjet.RawType;
  datePrévisionnelleActuelle: DateTime.RawType;
  datePrévisionnelleCorrecte: DateTime.RawType;
  écartJoursAvecDateCorrecte: number;
};

type LigneErreur = {
  identifiantProjet: IdentifiantProjet.RawType;
  raison: string;
};

type Stats = {
  total: number;
  succèsModification: Array<LigneSuccès>;
  succèsDéplacement: Array<LigneSuccès>;
  erreursÉcart: Array<LigneErreurÉcart>;
  erreurs: Array<LigneErreur>;
};

type EventInconnu = {
  identifiantProjet: IdentifiantProjet.RawType;
  eventVersion: number;
  datePrévisionnelleActuelle: DateTime.RawType;
};

const FICHIER_SUCCÈS =
  './correction-event-unique-date-achevement-calculée-inconnu-vers-notification_succès.csv';
const FICHIER_ERREUR_ÉCART =
  './correction-event-unique-date-achevement-calculée-inconnu-vers-notification_erreur-écart.csv';
const FICHIER_ERREURS =
  './correction-event-unique-date-achevement-calculée-inconnu-vers-notification_erreurs.csv';

export class CorrectionEventUniqueDateAchèvementCalculéeInconnuVersNotificationCommand extends Command {
  static override description =
    `Corriger les streams d'achèvement en s'assurant d'avoir en premier évènement un calcul de date prévisionnel post notification.
    ⚠️ On exclue volontairement les projets qui ont plusieurs évènements de calcul de date inconnu.
    Pour traiter ces cas, merci d'utiliser la commande dédiée. ⚠️`;

  async init() {
    envSchema.parse(process.env);
  }

  async run() {
    const stats: Stats = {
      total: 0,
      succèsModification: [],
      succèsDéplacement: [],
      erreursÉcart: [],
      erreurs: [],
    };

    const eventsAvecRaisonInconnu = await executeSelect<EventInconnu>(`
      SELECT
        payload->>'identifiantProjet' as "identifiantProjet",
        version as "eventVersion",
        payload->>'date' as "datePrévisionnelleActuelle"
      FROM event_store.event_stream
      WHERE stream_id LIKE 'achevement|%'
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND stream_id IN (
          SELECT stream_id
          FROM event_store.event_stream
          WHERE
            stream_id LIKE 'achevement|%'
            AND type = 'DateAchèvementPrévisionnelCalculée-V1'
            AND payload->>'raison' = 'inconnue'
          GROUP BY stream_id
          HAVING COUNT(*) = 1
        )
        AND stream_id NOT IN (
          SELECT stream_id
          FROM event_store.event_stream
          WHERE
            stream_id LIKE 'achevement|%'
            AND type = 'DateAchèvementPrévisionnelCalculée-V1'
            AND payload->>'raison' = 'notification'
        )
    `);

    stats.total = eventsAvecRaisonInconnu.length;

    if (stats.total === 0) {
      console.info('ℹ️  Aucun projet concerné');
      return;
    }

    try {
      console.info(`ℹ️ ${stats.total} projets à traiter`);

      console.info(`🔧 Suppression temporaire de la règle d'interdiction d'update des events`);
      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream`,
      );

      let compteur = 0;
      for (const {
        identifiantProjet,
        eventVersion,
        datePrévisionnelleActuelle,
      } of eventsAvecRaisonInconnu) {
        try {
          compteur++;
          process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

          const { datePrévisionnelleCorrecte, createdAt } =
            await getDonnéesCorrectes(identifiantProjet);

          const écartJours = DateTime.convertirEnValueType(
            datePrévisionnelleActuelle,
          ).nombreJoursÉcartAvec(DateTime.convertirEnValueType(datePrévisionnelleCorrecte));

          /**
           * Si la version de l'event est 1, on a juste à transformer cet évènement raison "notification"
           */
          if (eventVersion === 1) {
            await transformerEventInconnuEnEventNotification({
              identifiantProjet,
              date: datePrévisionnelleCorrecte,
              createdAt,
            });

            stats.succèsModification.push({
              identifiantProjet,
              datePrévisionnelleActuelle,
              datePrévisionnelleCorrecte,
              écartJours,
              opération: 'transformation',
            });

            continue;
          }

          /**
           * Si la version de l'event est > 1, on doit transformer l'event et le mettre en début de stream
           */
          if (écartJours > ECART_JOURS) {
            stats.erreursÉcart.push({
              identifiantProjet,
              datePrévisionnelleActuelle,
              datePrévisionnelleCorrecte,
              écartJoursAvecDateCorrecte: écartJours,
            });
            continue;
          }

          await déplacerEventEnPremierEtTransformerEnNotification({
            identifiantProjet,
            version: eventVersion,
            createdAt,
            date: datePrévisionnelleCorrecte,
          });

          stats.succèsDéplacement.push({
            identifiantProjet,
            datePrévisionnelleActuelle,
            datePrévisionnelleCorrecte,
            écartJours,
            opération: 'déplacement + transformation',
          });
        } catch (error) {
          stats.erreurs.push({
            identifiantProjet,
            raison: error instanceof Error ? error.message : String(error),
          });
        }
      }
    } finally {
      process.stdout.write('\n');
      console.info(`🔧 Ajout de la règle d'interdiction d'update des events`);
      await executeSelect(`
          CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
          select event_store.throw_when_trying_to_update_event();
        `);
    }

    const succès = [...stats.succèsModification, ...stats.succèsDéplacement];
    const totalSuccès = succès.length;
    const totalErreurs = stats.erreursÉcart.length + stats.erreurs.length;

    console.info(`\n📊 Résultat :`);
    console.info(`  ✅ ${totalSuccès} projets corrigés`);
    console.info(
      `     - ${stats.succèsModification.length} par modification de payload (version 1)`,
    );
    console.info(
      `     - ${stats.succèsDéplacement.length} par déplacement en première position (version > 1)`,
    );
    console.info(`  ❌ ${totalErreurs} projets en erreur`);
    console.info(
      `     - ${stats.erreursÉcart.length} car la date contenue dans le payload ne respecte pas l'écart de ${ECART_JOURS} jours`,
    );
    console.info(`     - ${stats.erreurs.length} pour erreurs autres`);

    if (succès.length) {
      await writeFile(
        FICHIER_SUCCÈS,
        await ExportCSV.toCSV({
          data: succès,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            { label: 'Date prévisionnelle actuelle', value: 'datePrévisionnelleActuelle' },
            { label: 'Date prévisionnelle correcte', value: 'datePrévisionnelleCorrecte' },
            { label: 'Écart jours', value: 'écartJours' },
            { label: 'Opération', value: 'opération' },
          ],
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des succès écrit dans ${FICHIER_SUCCÈS}`);
    }

    if (stats.erreursÉcart.length) {
      await writeFile(
        FICHIER_ERREUR_ÉCART,
        await ExportCSV.toCSV({
          data: stats.erreursÉcart,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            { label: 'Date prévisionnelle actuelle', value: 'datePrévisionnelleActuelle' },
            { label: 'Date prévisionnelle correcte', value: 'datePrévisionnelleCorrecte' },
            { label: 'Écart jours avec date correcte', value: 'écartJoursAvecDateCorrecte' },
          ],
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des erreurs d'écart écrit dans ${FICHIER_ERREUR_ÉCART}`);
    }

    if (stats.erreurs.length) {
      await writeFile(
        FICHIER_ERREURS,
        await ExportCSV.toCSV({
          data: stats.erreurs,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            { label: 'Raison', value: 'raison' },
          ],
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des erreurs écrit dans ${FICHIER_ERREURS}`);
    }

    const checkEventRestant = await executeSelect<{ total: number }>(
      `
        SELECT COUNT(*) as "total"
        FROM (
          SELECT stream_id
          FROM event_store.event_stream
          WHERE
            stream_id LIKE 'achevement|%'
            AND type = 'DateAchèvementPrévisionnelCalculée-V1'
            AND payload->>'raison' = 'inconnue'
          GROUP BY stream_id
          HAVING COUNT(*) > 1
        ) sub;
      `,
    );

    if (checkEventRestant[0].total > 0) {
      console.info(
        `⚠️ Attention il reste ${checkEventRestant[0].total} projets qui disposent de plusieurs évènement DateAchèvementPrévisionnelleCalculée-V1 avec comme raison "inconnue", il faut faire tourner la commande dédiée ⚠️`,
      );
    }
  }
}
