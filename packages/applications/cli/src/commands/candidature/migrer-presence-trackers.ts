import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

type Stats = {
  total: number;
  identifiantsProjetsAvecTracker: Array<{
    identifiantProjet: IdentifiantProjet.RawType;
    ancienneValeur: string;
  }>;

  errors: { identifiantProjet: IdentifiantProjet.RawType; message: string }[];
};

type ActualTrackerPossibleValue =
  | '1 axe'
  | 'Sans objet'
  | 'SO'
  | '-'
  | 'sans objet'
  | 'NA'
  | 'un axe'
  | 'non concerné'
  | 'nc'
  | 'Un axe'
  | 'Non applicable'
  | 'non applicable'
  | 'n/a'
  | 'Sans Objet'
  | "Ne s'applique pas"
  | 'Un axe (Oasis 3)'
  | 'Tracker un axe'
  | 'Tracker un axe '
  | 'Non concerné'
  | 'Tracker 1 axe'
  | 'Non applicable à ce projet'
  | 'na'
  | 'N.A.'
  | '/'
  | 'Trackers un axe'
  | 'Trackers'
  | '2 axes'
  | 'Trackers 1 axe "Oasis 3"'
  | 'Un axe et demi'
  | '1 axe Hz'
  | 'RAS'
  | 'TRACKERS'
  | 'non'
  | 'Deux axes'
  | 's/o'
  | 'Non pertinent'
  | '--'
  | '_';

const getPresenceDeTrackerBoolean = (value: ActualTrackerPossibleValue) =>
  match(value)
    .returnType<true | undefined>()
    .with(
      P.union(
        '1 axe',
        '1 axe Hz',
        '2 axes',
        'Deux axes',
        'TRACKERS',
        'Tracker 1 axe',
        'Tracker un axe',
        'Tracker un axe ',
        'Trackers',
        'Trackers 1 axe "Oasis 3"',
        'Trackers un axe',
        'Un axe',
        'Un axe (Oasis 3)',
        'Un axe et demi',
        'un axe',
      ),
      () => true,
    )
    .with(
      P.union(
        'N.A.',
        'NA',
        "Ne s'applique pas",
        'Non applicable',
        'Non applicable à ce projet',
        'Non concerné',
        'non concerné',
        'nc',
        'Non pertinent',
        'n/a',
        'na',
        'non applicable',
        'RAS',
        'non',
        '-',
        '--',
        '/',
        'SO',
        'Sans Objet',
        'Sans objet',
        '_',
        's/o',
        'sans objet',
      ),
      () => undefined,
    )
    .exhaustive();

export class Migrer extends Command {
  async init() {
    dbSchema.parse(process.env);

    AppelOffre.registerAppelOffreQueries({
      find: findProjection,
      list: listProjection,
    });
  }
  async run() {
    const stats: Stats = {
      total: 0,
      identifiantsProjetsAvecTracker: [],
      errors: [],
    };

    try {
      const candidaturesAvecTracker = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        trackerValue: ActualTrackerPossibleValue;
        technologie: Candidature.TypeTechnologie.RawType;
      }>(
        `
        WITH
            "detailCandidatures" AS (
                SELECT
                    payload->>'identifiantProjet' AS "identifiantProjet",
                    payload->'détail'->>'Technologie (Dispositifs de suivi de la course du soleil *)' AS "trackerValue"
                FROM
                    event_store.event_stream
                WHERE
                    type LIKE 'DétailCandidatureImporté-V%'
            ),
            "candidatures" AS (
                SELECT
                    payload->>'identifiantProjet' AS "identifiantProjet",
                    payload->>'technologie' AS "technologie"
                FROM
                    event_store.event_stream
                WHERE
                    type LIKE 'CandidatureImportée-V%'
            )
        SELECT
            "detailCandidatures"."identifiantProjet",
            "detailCandidatures"."trackerValue",
            "candidatures"."technologie"
        FROM
            "detailCandidatures"
            JOIN "candidatures" ON "candidatures"."identifiantProjet" = "detailCandidatures"."identifiantProjet"
        WHERE
            "detailCandidatures"."trackerValue" IS NOT NULL
        ORDER BY
            "detailCandidatures"."trackerValue";
      `,
      );

      if (!candidaturesAvecTracker.length) {
        throw new Error(
          "❌ Aucune candidature ne dispose d'informations sur la présence ou non de tracker",
        );
      }

      const appelsOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
        type: 'AppelOffre.Query.ListerAppelOffre',
        data: {},
      });

      if (!appelsOffres.items.length) {
        throw new Error("❌ Impossible de récupérer les appels d'offres");
      }

      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );

      stats.total = candidaturesAvecTracker.length;

      let count = 0;

      for (const { identifiantProjet, trackerValue, technologie } of candidaturesAvecTracker) {
        count++;
        process.stdout.write(`\r⏳ [${count}/${stats.total}]`);

        const aUnTracker = getPresenceDeTrackerBoolean(trackerValue);

        if (!aUnTracker) {
          continue;
        }

        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        const appelOffre = appelsOffres.items.find(
          (ao) => ao.id === identifiantProjetValueType.appelOffre,
        );

        if (!appelOffre) {
          stats.errors.push({
            identifiantProjet,
            message: `Impossible de retrouver l'appel d'offre du projet (${identifiantProjetValueType.appelOffre})`,
          });
          continue;
        }

        let technologieDéterminée: Candidature.TypeTechnologie.ValueType<AppelOffre.Technologie>;

        try {
          technologieDéterminée = Candidature.TypeTechnologie.déterminer({
            appelOffre,
            projet: { technologie },
          });
        } catch {
          stats.errors.push({
            identifiantProjet,
            message: `Impossible de déterminer la technologie du projet`,
          });
          continue;
        }

        if (technologieDéterminée.type !== 'pv') {
          stats.errors.push({
            identifiantProjet,
            message: `L'appel d'offre (${identifiantProjetValueType.appelOffre}) du projet (${identifiantProjet}) a comme technologie ${technologieDéterminée.type}, ce qui n'est pas une technologie PV`,
          });
          continue;
        }

        await executeQuery(
          `
          UPDATE event_store.event_stream
          SET payload = jsonb_set(
              payload,
              array['détail', 'Technologie (Dispositifs de suivi de la course du soleil *)'],
              to_jsonb('true'::text)
          )
          WHERE stream_id = $1
          AND type LIKE 'DétailCandidatureImporté-V%';
      `,
          `candidature|${identifiantProjet}`,
        );

        stats.identifiantsProjetsAvecTracker.push({
          identifiantProjet,
          ancienneValeur: trackerValue,
        });
      }

      await executeQuery(
        `
        CREATE OR REPLACE RULE prevent_update_on_event_stream as on update to event_store.event_stream do instead
        select event_store.throw_when_trying_to_update_event();
      `,
      );
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    process.stdout.write('\n');

    console.info(`\n📊 Résultat :`);
    console.info(
      `  ✅ ${stats.identifiantsProjetsAvecTracker.length} candidatures avec tracker à ajouter`,
    );
    console.info(`  ❌ ${stats.errors.length} erreurs`);

    if (stats.identifiantsProjetsAvecTracker.length) {
      await writeFile(
        './identifiantsProjetsAvecTrackers.csv',
        await ExportCSV.toCSV({
          data: stats.identifiantsProjetsAvecTracker,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            {
              label: 'Ancienne valeur',
              value: 'ancienneValeur',
            },
          ],
        }),
        'utf-8',
      );
    }

    if (stats.errors.length) {
      await writeFile(
        './errors.csv',
        await ExportCSV.toCSV({
          data: stats.errors,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            {
              label: 'Message',
              value: 'message',
            },
          ],
        }),
        'utf-8',
      );
    }
  }
}
