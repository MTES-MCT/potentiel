import { readFile, writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import z from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

const FICHIER_DOUBLONS = './doublons-calcul-date-achèvement-inconnu.txt';
const FICHIER_RAPPORT = './rapport-doublons-calcul-date-achèvement-inconnu.json';
const MARGE_JOURS = 2;

type EventInconnu = {
  version: number;
  date: string;
  écartJours: number;
  correspondance: boolean;
};

type RésultatAnalyse = 'match-unique' | 'match-multiple' | 'aucun-match' | 'erreur';

type AnalyseProjet = {
  identifiantProjet: string;
  résultat: RésultatAnalyse;
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

  const eventsInconnus = await executeSelect<{ version: number; date: string }>(
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
      correspondance: écartJours <= MARGE_JOURS,
    };
  });

  const matches = eventsAvecAnalyse.filter(({ correspondance }) => correspondance);

  let résultat: RésultatAnalyse;
  if (matches.length === 1) {
    résultat = 'match-unique';
  } else if (matches.length > 1) {
    résultat = 'match-multiple';
  } else {
    résultat = 'aucun-match';
  }

  return {
    identifiantProjet,
    résultat,
    dateAttendue,
    eventsInconnus: eventsAvecAnalyse,
  };
};

export class AnalyserDoublonsCalculDateAchevementInconnu extends Command {
  static override description =
    `Analyser les projets avec plusieurs events DateAchèvementPrévisionnelCalculée-V1
    à raison "inconnue" pour tenter un rapprochement avec la date post-notification (±${MARGE_JOURS}j)`;

  async run() {
    envSchema.parse(process.env);

    const contenu = await readFile(FICHIER_DOUBLONS, 'utf-8');
    const identifiantsProjets = contenu
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean) as Array<IdentifiantProjet.RawType>;

    const total = identifiantsProjets.length;
    console.info(`ℹ️  ${total} projets à analyser depuis ${FICHIER_DOUBLONS}`);

    const résultats: Array<AnalyseProjet> = [];
    let compteur = 0;

    for (const identifiantProjet of identifiantsProjets) {
      compteur++;
      process.stdout.write(`\r⏳ [${compteur}/${total}] ${identifiantProjet}`);

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
    console.info(`  ✅ ${matchUnique.length} projets avec un match unique (±${MARGE_JOURS}j)`);
    console.info(`  ⚠️  ${matchMultiple.length} projets avec plusieurs matches`);
    console.info(`  ❓ ${aucunMatch.length} projets sans match`);
    console.info(`  ❌ ${erreurs.length} erreurs`);

    await writeFile(FICHIER_RAPPORT, JSON.stringify(résultats, null, 2), 'utf-8');
    console.info(`\n📄 Rapport complet écrit dans ${FICHIER_RAPPORT}`);
  }
}
