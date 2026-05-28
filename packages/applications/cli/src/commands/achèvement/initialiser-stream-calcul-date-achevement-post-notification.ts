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
  succès: Array<{ identifiantProjet: string }>;
  nonTraitésCarVersionSupérieureÀ1: number;
  erreurs: Array<{ identifiantProjet: string; raison: string }>;
};

const modifierEventInconnuVersNotification = async ({
  identifiantProjet,
}: {
  identifiantProjet: IdentifiantProjet.RawType;
}) => {
  const projet = await ProjetAdapter.getProjetAggregateRootAdapter(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  const dateCorrecte = await projet.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
    type: 'notification',
  });

  const createdAt = projet.lauréat.notifiéLe.ajouterNombreDeMillisecondes(500).formatter();

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
    JSON.stringify(dateCorrecte),
  );
};

export class InitialiserStreamAchevementAvecCalculDatePrévisionnellePostNotification extends Command {
  static override description =
    `Corriger les streams d'achèvement en s'assurant d'avoir en premier évènement un 
    calcul de date prévisionnel post notification`;

  async run() {
    envSchema.parse(process.env);

    const stats: Stats = {
      total: 0,
      succès: [],
      nonTraitésCarVersionSupérieureÀ1: 0,
      erreurs: [],
    };

    const projetsAvecEventInconnuOuNotification = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
      eventVersion: number;
    }>(`
      SELECT
        payload->>'identifiantProjet' as "identifiantProjet",
        version as "eventVersion"
      FROM event_store.event_stream
      WHERE
        stream_id LIKE 'achevement|%'
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
    `);

    stats.total = projetsAvecEventInconnuOuNotification.length;

    if (stats.total === 0) {
      console.info('ℹ️  Aucun projet concerné');
      return;
    }

    console.info(`ℹ️  ${stats.total} projets concernés`);

    console.info(`ℹ️ Suppression temporaire de la règle d'interdiction d'update des events`);
    await executeQuery(
      `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream`,
    );

    for (const { identifiantProjet, eventVersion } of projetsAvecEventInconnuOuNotification) {
      if (eventVersion !== 1) {
        /**
         * TODO : Va être traité prochainement
         */
        stats.nonTraitésCarVersionSupérieureÀ1++;
        continue;
      }

      try {
        await modifierEventInconnuVersNotification({ identifiantProjet });
        stats.succès.push({ identifiantProjet });
      } catch (error) {
        stats.erreurs.push({
          identifiantProjet,
          raison: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.info(`ℹ️ Ajout de la règle d'interdiction d'update des events`);
    await executeSelect(`
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `);

    console.info(`\n📊 Résultat :`);
    console.info(`  ✅ ${stats.succès.length} projets corrigés`);
    console.info(
      `  ⏭️  ${stats.nonTraitésCarVersionSupérieureÀ1} projets non traités car la version de l'évènement est > 1`,
    );
    console.info(`  ❌ ${stats.erreurs.length} erreurs`);
    console.info(`\nExemple de projet succès`);
    for (const { identifiantProjet } of stats.succès.slice(0, 10)) {
      console.log(`✅ ${identifiantProjet}`);
    }
  }
}
