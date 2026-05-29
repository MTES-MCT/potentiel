import { Command } from '@oclif/core';
import z from 'zod';

import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';
import {
  DateAvecÉcartDeJoursTropImportantError,
  déplacerEventInconnuEnPremier,
  ECART_JOURS,
  getDonnéesCorrectes,
  vérifierDateAchèvementPrévisionnelDansÉcart,
} from '#helpers/achèvement';

const envSchema = z.object({
  ...dbSchema.shape,
});

type Stats = {
  total: number;
  succèsModification: Array<{ identifiantProjet: IdentifiantProjet.RawType }>;
  succèsDéplacement: Array<{ identifiantProjet: IdentifiantProjet.RawType }>;
  erreurDéplacement: Array<{ identifiantProjet: IdentifiantProjet.RawType }>;
  erreurs: Array<{ identifiantProjet: IdentifiantProjet.RawType; raison: string }>;
};

type EventInconnu = {
  identifiantProjet: IdentifiantProjet.RawType;
  eventVersion: number;
  datePrévisionnelleExistante: DateTime.RawType;
};

type ModifierRaisonEventInconnuProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  createdAt: DateTime.RawType;
  date: DateTime.RawType;
};
const modifierRaisonEventInconnu = async ({
  identifiantProjet,
  createdAt,
  date,
}: ModifierRaisonEventInconnuProps) => {
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET
        created_at = $2,
        payload = jsonb_set(jsonb_set(payload, '{raison}', $3::jsonb), '{date}', $4::jsonb)
      WHERE
        stream_id = $1
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND version = 1
    `,
    `achevement|${identifiantProjet}`,
    createdAt,
    JSON.stringify('notification'),
    JSON.stringify(date),
  );
};

export class CorrigerCalculDatePrévisionnelleRaisonInconnueSimpleCommand extends Command {
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
      erreurDéplacement: [],
      erreurs: [],
    };

    const eventsAvecRaisonInconnu = await executeSelect<EventInconnu>(`
      SELECT
        payload->>'identifiantProjet' as "identifiantProjet",
        version as "eventVersion",
        payload->>'date' as "datePrévisionnelleExistante"
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
        datePrévisionnelleExistante,
      } of eventsAvecRaisonInconnu) {
        try {
          compteur++;
          process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

          const { dateCorrecte, createdAt } = await getDonnéesCorrectes(identifiantProjet);

          if (eventVersion === 1) {
            await modifierRaisonEventInconnu({ identifiantProjet, date: dateCorrecte, createdAt });

            stats.succèsModification.push({ identifiantProjet });

            continue;
          }

          const estDansÉcart = await vérifierDateAchèvementPrévisionnelDansÉcart({
            identifiantProjet,
            dateÀVérifier: datePrévisionnelleExistante,
          });

          if (!estDansÉcart) {
            throw new DateAvecÉcartDeJoursTropImportantError(identifiantProjet);
          }

          await déplacerEventInconnuEnPremier({
            identifiantProjet,
            version: eventVersion,
            createdAt,
            date: datePrévisionnelleExistante,
          });
          stats.succèsDéplacement.push({ identifiantProjet });
        } catch (error) {
          if (error instanceof DateAvecÉcartDeJoursTropImportantError) {
            stats.erreurDéplacement.push({ identifiantProjet });
            continue;
          }

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

    const totalSuccès = stats.succèsModification.length + stats.succèsDéplacement.length;
    const totalErreurs = stats.erreurDéplacement.length + stats.erreurs.length;

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
      `     - ${stats.erreurDéplacement.length} car la date contenue dans le payload ne respecte pas l'écart de ${ECART_JOURS} jours`,
    );
    console.info(`     - ${stats.erreurs.length} pour erreurs autres`);

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
