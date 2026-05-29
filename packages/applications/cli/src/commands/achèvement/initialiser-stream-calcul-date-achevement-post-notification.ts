import { Command } from '@oclif/core';
import z from 'zod';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

type Stats = {
  total: number;
  succèsModification: Array<{ identifiantProjet: string }>;
  succèsDéplacement: Array<{ identifiantProjet: string }>;
  erreurs: Array<{ identifiantProjet: string; raison: string }>;
};

type GetDonnéesCorrectesProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};
const getDonnéesCorrectes = async ({ identifiantProjet }: GetDonnéesCorrectesProps) => {
  const projet = await ProjetAdapter.getProjetAggregateRootAdapter(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  const date = await projet.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
    type: 'notification',
  });

  const createdAt = projet.lauréat.notifiéLe.ajouterNombreDeMillisecondes(500).formatter();

  return { date, createdAt };
};

type ModifierRaisonEventInconnuProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};
const modifierRaisonEventInconnu = async ({
  identifiantProjet,
}: ModifierRaisonEventInconnuProps) => {
  const { date, createdAt } = await getDonnéesCorrectes({ identifiantProjet });

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

type DeplacerEventInconnuEnPremierProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  eventVersion: number;
};
const deplacerEventInconnuEnPremier = async ({
  identifiantProjet,
  eventVersion,
}: DeplacerEventInconnuEnPremierProps) => {
  const { date, createdAt } = await getDonnéesCorrectes({ identifiantProjet });
  const streamId = `achevement|${identifiantProjet}`;

  // Mise en version temporaire négative pour libérer la version 1
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET version = -1
      WHERE stream_id = $1
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND version = $2
    `,
    streamId,
    eventVersion,
  );

  // Incrémentation de la version des events précédents uniquement
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET version = version + 1
      WHERE stream_id = $1
        AND version > 0
        AND version < $2
    `,
    streamId,
    eventVersion,
  );

  // Placement de l'event en version 1 avec le payload corrigé
  await executeQuery(
    `
      UPDATE event_store.event_stream
      SET
        version = 1,
        created_at = $2,
        payload = jsonb_set(jsonb_set(payload, '{raison}', $3::jsonb), '{date}', $4::jsonb)
      WHERE stream_id = $1
        AND version = -1
    `,
    streamId,
    createdAt,
    JSON.stringify('notification'),
    JSON.stringify(date),
  );
};

export class InitialiserStreamAchevementAvecCalculDatePrévisionnellePostNotification extends Command {
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
      erreurs: [],
    };

    const eventsInconnu = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
      eventVersion: number;
    }>(`
      SELECT
        payload->>'identifiantProjet' as "identifiantProjet",
        version as "eventVersion"
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
    `);

    stats.total = eventsInconnu.length;

    if (stats.total === 0) {
      console.info('ℹ️  Aucun projet concerné');
      return;
    }

    console.info(`ℹ️ ${stats.total} projets à traiter`);

    console.info(`🔧 Suppression temporaire de la règle d'interdiction d'update des events`);
    await executeQuery(
      `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream`,
    );

    let compteur = 0;
    for (const { identifiantProjet, eventVersion } of eventsInconnu) {
      compteur++;
      process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

      try {
        if (eventVersion === 1) {
          await modifierRaisonEventInconnu({ identifiantProjet });
          stats.succèsModification.push({ identifiantProjet });
        } else {
          await deplacerEventInconnuEnPremier({ identifiantProjet, eventVersion });
          stats.succèsDéplacement.push({ identifiantProjet });
        }
      } catch (error) {
        stats.erreurs.push({
          identifiantProjet,
          raison: error instanceof Error ? error.message : String(error),
        });
      }
    }
    process.stdout.write('\n');

    console.info(`🔧 Ajout de la règle d'interdiction d'update des events`);
    await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);

    const totalSuccès = stats.succèsModification.length + stats.succèsDéplacement.length;

    console.info(`\n📊 Résultat :`);
    console.info(`  ✅ ${totalSuccès} projets corrigés`);
    console.info(
      `     - ${stats.succèsModification.length} par modification de payload (version 1)`,
    );
    console.info(
      `     - ${stats.succèsDéplacement.length} par déplacement en première position (version > 1)`,
    );

    console.info(`  ❌ ${stats.erreurs.length} erreurs`);

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
