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

const FICHIER_SUCCÈS = './rapport-multiple_succès.csv';
const FICHIER_AUCUN_MATCH = './rapport-multiple_aucun-match.csv';
const FICHIER_ERREURS = './rapport-multiple_erreurs.csv';

type EventInconnu = {
  version: number;
  date: DateTime.RawType;
  écartJours: number;
  correspondance: boolean;
};

type LigneSuccès = {
  identifiantProjet: IdentifiantProjet.RawType;
  versionSource: number;
  datePrévisionnelleChoisie: DateTime.RawType;
  dateCorrecte: DateTime.RawType;
  écartJours: number;
  opération: 'transformation' | 'déplacement + transformation';
};

type LigneAucunMatch = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateCorrecte: string;
  eventVersion: number;
  datePrévisionnelleCandidat: DateTime.RawType;
  écartJours: number;
};

type LigneErreur = {
  identifiantProjet: IdentifiantProjet.RawType;
  raison: string;
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

    const succès: Array<LigneSuccès> = [];
    const aucunMatch: Array<LigneAucunMatch> = [];
    const erreurs: Array<LigneErreur> = [];

    try {
      const total = eventsAvecRaisonInconnuMultiple.length;
      console.info(`ℹ️  ${total} projets à corriger`);

      console.info(`🔧 Suppression temporaire de la règle d'interdiction d'update des events`);
      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream`,
      );

      let compteur = 0;

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
            for (const { version, date, écartJours } of évènementsAvecÉcart) {
              aucunMatch.push({
                identifiantProjet,
                dateCorrecte,
                eventVersion: version,
                datePrévisionnelleCandidat: date,
                écartJours,
              });
            }
            continue;
          }

          /**
           * Si 1 seule correspondance, alors on peut transformer ou déplacer l'event
           * en fonction de son numéro de version existant
           */
          if (correspondances.length === 1) {
            const [{ version, date, écartJours }] = correspondances;

            if (version === 1) {
              await transformerEventInconnuEnEventNotification({
                identifiantProjet,
                createdAt,
                date: dateCorrecte,
              });

              succès.push({
                identifiantProjet,
                versionSource: version,
                datePrévisionnelleChoisie: date,
                dateCorrecte,
                écartJours,
                opération: 'transformation',
              });
              continue;
            }

            await déplacerEventEnPremierEtTransformerEnNotification({
              identifiantProjet,
              version,
              createdAt,
              date: dateCorrecte,
            });

            succès.push({
              identifiantProjet,
              versionSource: version,
              datePrévisionnelleChoisie: date,
              dateCorrecte,
              écartJours,
              opération: 'déplacement + transformation',
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

            succès.push({
              identifiantProjet,
              versionSource: plusAncienneCorrespondance.version,
              datePrévisionnelleChoisie: plusAncienneCorrespondance.date,
              dateCorrecte,
              écartJours: plusAncienneCorrespondance.écartJours,
              opération: 'transformation',
            });
            continue;
          }

          await déplacerEventEnPremierEtTransformerEnNotification({
            identifiantProjet,
            version: plusAncienneCorrespondance.version,
            createdAt,
            date: dateCorrecte,
          });

          succès.push({
            identifiantProjet,
            versionSource: plusAncienneCorrespondance.version,
            datePrévisionnelleChoisie: plusAncienneCorrespondance.date,
            dateCorrecte,
            écartJours: plusAncienneCorrespondance.écartJours,
            opération: 'déplacement + transformation',
          });
        } catch (error) {
          erreurs.push({
            identifiantProjet,
            raison: error instanceof Error ? error.message : String(error),
          });
        }
      }

      console.info(`\n📊 Résultat :`);
      console.info(`  ✅ ${succès.length} projets corrigés`);
      console.info(`  ❓ ${aucunMatch.length} projets sans match`);
      console.info(`  ❌ ${erreurs.length} erreurs`);

      if (succès.length) {
        await writeFile(
          FICHIER_SUCCÈS,
          await ExportCSV.toCSV({
            data: succès,
            fields: [
              { label: 'Identifiant projet', value: 'identifiantProjet' },
              { label: 'Version source', value: 'versionSource' },
              { label: 'Date prévisionnelle choisie', value: 'datePrévisionnelleChoisie' },
              { label: 'Date correcte', value: 'dateCorrecte' },
              { label: 'Écart jours', value: 'écartJours' },
              { label: 'Opération', value: 'opération' },
            ],
          }),
          'utf-8',
        );
        console.info(`\n📄 Rapport des succès écrit dans ${FICHIER_SUCCÈS}`);
      }

      if (aucunMatch.length) {
        await writeFile(
          FICHIER_AUCUN_MATCH,
          await ExportCSV.toCSV({
            data: aucunMatch,
            fields: [
              { label: 'Identifiant projet', value: 'identifiantProjet' },
              { label: 'Date correcte', value: 'dateCorrecte' },
              { label: 'Version event candidat', value: 'eventVersion' },
              { label: 'Date prévisionnelle candidate', value: 'datePrévisionnelleCandidat' },
              { label: 'Écart jours', value: 'écartJours' },
            ],
          }),
          'utf-8',
        );
        console.info(`\n📄 Rapport des aucun-match écrit dans ${FICHIER_AUCUN_MATCH}`);
      }

      if (erreurs.length) {
        await writeFile(
          FICHIER_ERREURS,
          await ExportCSV.toCSV({
            data: erreurs,
            fields: [
              { label: 'Identifiant projet', value: 'identifiantProjet' },
              { label: 'Raison', value: 'raison' },
            ],
          }),
          'utf-8',
        );
        console.info(`\n📄 Rapport des erreurs écrit dans ${FICHIER_ERREURS}`);
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
