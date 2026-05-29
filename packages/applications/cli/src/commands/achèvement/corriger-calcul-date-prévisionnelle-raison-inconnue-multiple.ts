import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';
import { ECART_JOURS } from '../../helpers/achèvement/écartJour.constant.js';

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
type AnalyserDoublonProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const analyserDoublon = async ({
  identifiantProjet,
}: AnalyserDoublonProps): Promise<AnalyseProjet> => {
  const projet = await ProjetAdapter.getProjetAggregateRootAdapter(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  const dateAttendue = await projet.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
    type: 'notification',
  });
  const dateAttendueValueType = DateTime.convertirEnValueType(dateAttendue);

  const eventsInconnus = await executeSelect<{
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

  const eventsAvecAnalyse: Array<EventInconnu> = eventsInconnus.map(({ version, date }) => {
    const dateEvent = DateTime.convertirEnValueType(date);
    const écartJours = dateEvent.nombreJoursÉcartAvec(dateAttendueValueType);
    return {
      version,
      date,
      écartJours,
      correspondance: écartJours <= ECART_JOURS,
    };
  });

  const matches = eventsAvecAnalyse.filter(({ correspondance }) => correspondance);

  return {
    identifiantProjet,
    résultat:
      matches.length === 1 ? 'match-unique' : matches.length > 1 ? 'match-multiple' : 'aucun-match',
    dateAttendue,
    eventsInconnus: eventsAvecAnalyse,
  };
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

    const total = eventsAvecRaisonInconnuMultiple.length;
    console.info(`ℹ️  ${total} projets à analyser`);

    let compteur = 0;
    const résultats: Array<AnalyseProjet> = [];
    for (const { identifiantProjet } of eventsAvecRaisonInconnuMultiple) {
      compteur++;
      process.stdout.write(`\r⏳ [${compteur}/${total}]`);

      try {
        const analyse = await analyserDoublon({ identifiantProjet });
        résultats.push(analyse);
      } catch (error) {
        résultats.push({
          identifiantProjet,
          résultat: 'erreur',
          raison: error instanceof Error ? error.message : String(error),
        });
      }
    }

    process.stdout.write('\n');

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
      console.info(`\n📄 Rapport des match multiple écrit dans ${FICHIER_RAPPORT_MATCH_MULTIPLE}`);
    }
    if (aucunMatch.length) {
      await writeFile(FICHIER_RAPPORT_AUCUN_MATCH, JSON.stringify(aucunMatch, null, 2), 'utf-8');
      console.info(`\n📄 Rapport des match multiple écrit dans ${FICHIER_RAPPORT_AUCUN_MATCH}`);
    }
    if (erreurs.length) {
      await writeFile(FICHIER_RAPPORT_ERREUR, JSON.stringify(matchMultiple, null, 2), 'utf-8');
      console.info(`\n📄 Rapport des erreurs écrit dans ${FICHIER_RAPPORT_ERREUR}`);
    }
  }
}
