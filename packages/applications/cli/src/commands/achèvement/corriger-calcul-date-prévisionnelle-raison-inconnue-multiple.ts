import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
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

const FICHIER_RAPPORT_ERREUR = './rapport-doublons-calcul-date-achèvement-inconnu_erreurs.json';
const FICHIER_RAPPORT_MATCH_MULTIPLE =
  './rapport-doublons-calcul-date-achèvement-inconnu_match-multipe.json';
const FICHIER_RAPPORT_AUCUN_MATCH =
  './rapport-doublons-calcul-date-achèvement-inconnu_aucun-match.json';

type EventInconnu = {
  version: number;
  date: DateTime.RawType;
  écartJours: number;
  correspondance: boolean;
};

type AnalyseProjet = {
  identifiantProjet: IdentifiantProjet.RawType;
  résultat: 'match-unique' | 'match-multiple' | 'aucun-match' | 'erreur';
  dateAttendue?: string;
  eventsInconnus?: Array<EventInconnu>;
  raison?: string;
};

export class CorrigerCalculDatePrévisionnelleRaisonInconnueMultipleCommand extends Command {
  static override description =
    `Analyser les projets avec plusieurs events DateAchèvementPrévisionnelCalculée-V1 à raison "inconnue" pour tenter un rapprochement avec la date post-notification (±${ECART_JOURS}j)`;

  async init() {
    envSchema.parse(process.env);
  }

  async run() {
    const eventsAvecRaisonInconnuMultiple = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
    }>(
      `
      SELECT payload->>'identifiantProjet' as "identifiantProjet"
      FROM event_store.event_stream
      WHERE
        stream_id LIKE 'achevement|%'
        AND type = 'DateAchèvementPrévisionnelCalculée-V1'
        AND payload->>'raison' = 'inconnue'
        AND stream_id NOT IN (
          SELECT stream_id
          FROM event_store.event_stream
          WHERE
            stream_id LIKE 'achevement|%'
            AND type = 'DateAchèvementPrévisionnelCalculée-V1'
            AND payload->>'raison' = 'notification'
        )
      GROUP BY "identifiantProjet"
      HAVING COUNT(*) > 1
      `,
    );

    if (!eventsAvecRaisonInconnuMultiple.length) {
      console.info('ℹ️  Aucun projet concerné');
      return;
    }

    try {
      const total = eventsAvecRaisonInconnuMultiple.length;
      console.info(`ℹ️  ${total} projets à corriger`);

      console.info(`🔧 Suppression temporaire de la règle d'interdiction d'update des events`);
      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream`,
      );

      let compteur = 0;
      const résultats: Array<AnalyseProjet> = [];

      for (const { identifiantProjet } of eventsAvecRaisonInconnuMultiple) {
        try {
          compteur++;
          process.stdout.write(`\r⏳ [${compteur}/${total}]`);

          const { createdAt, dateCorrecte } = await getDonnéesCorrectes(identifiantProjet);

          const eventStreamAvecEventsInconnu = await executeSelect<{
            version: EventInconnu['version'];
            date: EventInconnu['date'];
          }>(
            `
              SELECT
                version,
                payload->>'date' as date
              FROM event_store.event_stream
              WHERE
                stream_id = $1
                AND type = 'DateAchèvementPrévisionnelCalculée-V1'
                AND payload->>'raison' = 'inconnue'
              ORDER BY version
  `,
            `achevement|${identifiantProjet}`,
          );

          const évènementsAvecÉcart: EventInconnu[] = eventStreamAvecEventsInconnu.map(
            ({ version, date }) => {
              const écartJours = DateTime.convertirEnValueType(date).nombreJoursÉcartAvec(
                DateTime.convertirEnValueType(dateCorrecte),
              );
              return { version, date, écartJours, correspondance: écartJours <= ECART_JOURS };
            },
          );

          const correspondances = évènementsAvecÉcart.filter(
            ({ correspondance }) => correspondance,
          );

          if (correspondances.length === 0) {
            résultats.push({
              identifiantProjet,
              résultat: 'aucun-match',
              dateAttendue: dateCorrecte,
              eventsInconnus: évènementsAvecÉcart,
            });
            continue;
          }

          /**
           * Si 1 seule correspondance, alors on peut transformer ou déplacer l'event
           * en fonction de son numéro de version existant
           */
          if (correspondances.length === 1) {
            const [{ version }] = correspondances;

            if (version === 1) {
              await transformerEventInconnuEnEventNotification({
                identifiantProjet,
                createdAt,
                date: dateCorrecte,
              });
              continue;
            }

            await déplacerEventEnPremierEtTransformerEnNotification({
              identifiantProjet,
              version,
              createdAt,
              date: dateCorrecte,
            });

            continue;
          }

          /**
           * Si plusieurs correspondances sont trouvées, alors on séléctionne celle qui a
           * le nombre d'écart de jours le plus faible, et qui a la plus petite version.
           */
          const plusAncienneCorrespondance = correspondances.sort(
            (a, b) => a.écartJours - b.écartJours || a.version - b.version,
          )[0];

          if (plusAncienneCorrespondance.version === 1) {
            await transformerEventInconnuEnEventNotification({
              identifiantProjet,
              createdAt,
              date: dateCorrecte,
            });
            continue;
          }

          await déplacerEventEnPremierEtTransformerEnNotification({
            identifiantProjet,
            version: plusAncienneCorrespondance.version,
            createdAt,
            date: dateCorrecte,
          });
        } catch (error) {
          résultats.push({
            identifiantProjet,
            résultat: 'erreur',
            raison: error instanceof Error ? error.message : String(error),
          });
        }
      }

      const matchUnique = résultats.filter(({ résultat }) => résultat === 'match-unique');
      const matchMultiple = résultats.filter(({ résultat }) => résultat === 'match-multiple');
      const aucunMatch = résultats.filter(({ résultat }) => résultat === 'aucun-match');
      const erreurs = résultats.filter(({ résultat }) => résultat === 'erreur');

      console.info(`\n📊 Résultat :`);
      console.info(`  ✅ ${matchUnique.length} projets avec un match unique (±${ECART_JOURS}j)`);
      console.info(`  ⚠️  ${matchMultiple.length} projets avec plusieurs matches`);
      console.info(`  ❓ ${aucunMatch.length} projets sans match`);
      console.info(`  ❌ ${erreurs.length} erreurs`);

      if (matchMultiple.length) {
        await writeFile(
          FICHIER_RAPPORT_MATCH_MULTIPLE,
          JSON.stringify(matchMultiple, null, 2),
          'utf-8',
        );
        console.info(
          `\n📄 Rapport des match multiple écrit dans ${FICHIER_RAPPORT_MATCH_MULTIPLE}`,
        );
      }
      if (aucunMatch.length) {
        await writeFile(FICHIER_RAPPORT_AUCUN_MATCH, JSON.stringify(aucunMatch, null, 2), 'utf-8');
        console.info(`\n📄 Rapport des match multiple écrit dans ${FICHIER_RAPPORT_AUCUN_MATCH}`);
      }
      if (erreurs.length) {
        await writeFile(FICHIER_RAPPORT_ERREUR, JSON.stringify(erreurs, null, 2), 'utf-8');
        console.info(`\n📄 Rapport des erreurs écrit dans ${FICHIER_RAPPORT_ERREUR}`);
      }
    } finally {
      process.stdout.write('\n');
      console.info(`🔧 Ajout de la règle d'interdiction d'update des events`);
      await executeSelect(`
          CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
          select event_store.throw_when_trying_to_update_event();
        `);
    }
  }
}
