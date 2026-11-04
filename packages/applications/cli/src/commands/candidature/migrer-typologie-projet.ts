import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import { match, P } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

type Stats = {
  total: number;
  sucess: Array<{
    identifiantProjet: IdentifiantProjet.RawType;
    valeurDétail: ActualTypologieProjetPossibleValue;
    valueTypologie: Candidature.TypologieInstallation.RawType['typologie'];
  }>;

  errors: Array<{ identifiantProjet: IdentifiantProjet.RawType; message: string }>;
};

type ActualTypologieProjetPossibleValue =
  | 'Centre commercial'
  | 'AO PV Bâtiment - Hangar'
  | "Candidat à l'AO PV Bâtiment/Neutre - Ombrière agrivoltaïque"
  | 'Serre agrivoltaïque + Ombrière agrivoltaïque'
  | 'AO PV Bâtiment - Serre agrivoltaïque'
  | "Candidat à l'AO PV Bâtiment/Neutre - Ombrière de parking"
  | "Candidat à l'AO PV Bâtiment/Neutre - Serre agrivoltaïque"
  | 'Transport'
  | 'AO PV Sol - Flottant'
  | 'Paul-François Croisille'
  | 'Cas 3 et autre'
  | 'Eolien'
  | 'Hangar agricole'
  | 'AO PV Bâtiment - Bâtiment'
  | 'Hypermarché'
  | 'Exploitation Agricole'
  | 'PV Sol'
  | 'Bureaux'
  | 'Bâti agricole (serre ou hangar)'
  | 'Collectivité '
  | 'Cas 3'
  | 'AO PV Bâtiment - Ombrière autre'
  | "Candidat à l'AO PV Sol/Neutre - Flottant"
  | 'Ombrière autre'
  | 'Producteur '
  | 'Methaniseur Agricole'
  | 'Exploitation'
  | 'Serre agrivoltaïque'
  | 'Sol'
  | 'Zoo'
  | 'Public'
  | 'Flottant'
  | 'Bâti standard'
  | 'PLI_2019_FmvxZuwgxX'
  | 'Bâtiment non agricole'
  | 'Supermarché '
  | 'Supermarché'
  | 'Bâtiment agricole'
  | 'Industrie'
  | 'Ombrière de parking'
  | 'Mixte'
  | 'Ombrière'
  | 'PLI_2019_B7vWlnjqBC'
  | 'Centre commercial '
  | 'Bâtiment'
  | 'Entrepôt frigorifique'
  | "Candidat à l'AO PV Sol/Neutre - Sol"
  | 'Ombrière agrivoltaïque'
  | 'JOBARD Thibaut'
  | 'ANDRIEU Stéphanie'
  | 'Industriel'
  | 'Hangar'
  | 'STEP'
  | 'AO PV Sol - Sol'
  | "Candidat à l'AO PV Bâtiment/Neutre - Bâtiment"
  | 'Commerce'
  | 'industrie'
  | 'Serre agrivoltaïque + Hangar'
  | 'PLI_2019_jdvwitkqHt'
  | 'AO PV Bâtiment - Ombrière agrivoltaïque'
  | 'Serre'
  | 'AO PV Bâtiment - Ombrière de parking'
  | 'PC'
  | 'Methaniseur Agricole ';

const getTypologieInstallation = (value: ActualTypologieProjetPossibleValue) =>
  match(value)
    .returnType<Candidature.TypologieInstallation.RawType['typologie'] | undefined>()

    //#region BATIMENT
    .with(
      P.union(
        'AO PV Bâtiment - Bâtiment',
        'Bâtiment',
        'Bâti standard',
        "Candidat à l'AO PV Bâtiment/Neutre - Bâtiment",
        'Bâtiment non agricole',
        'Hangar',
        'AO PV Bâtiment - Hangar',
        'Bâtiment agricole',
        'Bâti agricole (serre ou hangar)',
        'Centre commercial',
        'Centre commercial ',
        'Commerce',
        'Hypermarché',
        'Supermarché',
        'Supermarché ',
      ),
      () => 'bâtiment.non-précisé',
    )

    .with(
      P.union("Candidat à l'AO PV Bâtiment/Neutre - Serre agrivoltaïque"),
      () => 'bâtiment.serre',
    )

    //#region SOL
    .with(
      P.union('AO PV Sol - Sol', 'PV Sol', "Candidat à l'AO PV Sol/Neutre - Sol", 'Sol', 'Cas 3'),
      () => 'sol.non-précisé',
    )

    .with(
      P.union('AO PV Sol - Flottant', 'Flottant', "Candidat à l'AO PV Sol/Neutre - Flottant"),
      () => 'sol.flottant',
    )
    //#region OMBRIERE
    .with(
      P.union(
        "Candidat à l'AO PV Bâtiment/Neutre - Ombrière de parking",
        'AO PV Bâtiment - Ombrière de parking',
        'Ombrière de parking',
      ),
      () => 'ombrière.parking',
    )

    .with(
      P.union('AO PV Bâtiment - Ombrière autre', 'Ombrière autre', 'Ombrière'),
      () => 'ombrière.autre',
    )

    //#region AGRIVOLTAÏQUE

    .with(
      P.union('Serre agrivoltaïque', 'AO PV Bâtiment - Serre agrivoltaïque'),
      () => 'agrivoltaïque.serre',
    )

    .with('Serre agrivoltaïque + Ombrière agrivoltaïque', () => 'ombrière.mixte')

    ///////////// UNDEFINED /////////////

    .with(
      P.union(
        'ANDRIEU Stéphanie',
        'JOBARD Thibaut',
        'Producteur ',
        'Public',
        'Paul-François Croisille',
        'PLI_2019_B7vWlnjqBC',
        'PLI_2019_FmvxZuwgxX',
        'PLI_2019_jdvwitkqHt',
        'Serre',
        'Cas 3 et autre',
        'Collectivité ',
        'Mixte',
        'PC',
        'STEP',
        'Transport',
        'Zoo',
        'Entrepôt frigorifique',
        'industrie',
        'Industrie',
        'Industriel',
        'Methaniseur Agricole',
        'Methaniseur Agricole ',
        'Exploitation',
        'Exploitation Agricole',
        'Hangar agricole',
        'Bureaux',
        'AO PV Bâtiment - Ombrière agrivoltaïque',
        'Ombrière agrivoltaïque',
        "Candidat à l'AO PV Bâtiment/Neutre - Ombrière agrivoltaïque",
        'Eolien',
        'Serre agrivoltaïque + Hangar',
      ),
      () => undefined,
    )
    .exhaustive();

export class Migrer extends Command {
  async init() {
    dbSchema.parse(process.env);
  }
  async run() {
    const stats: Stats = {
      total: 0,
      sucess: [],
      errors: [],
    };

    try {
      const projets = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        typologieDeProjet: ActualTypologieProjetPossibleValue;
      }>(`
        with dernier_detail as (
          select distinct on (es.payload->>'identifiantProjet')
            es.payload->>'identifiantProjet'  as "identifiantProjet",
            es.payload->'détail'->>'Typologie de projet'     as "typologieDeProjet"
          from event_store.event_stream es
          where es.type = 'DétailCandidatureImporté-V1'
          order by es.payload->>'identifiantProjet', es.created_at desc   -- adapte la colonne d'ordre (created_at / version / position)
        )
        select d.*
        from dernier_detail d
        where d."typologieDeProjet" is not null
        and not exists (
          select 1
          from domain_views.projection p
          where p.key = format('installation|%s', d."identifiantProjet")
        )
        and  exists (
          select 1
          from domain_views.projection p
          where p.key = format('lauréat|%s', d."identifiantProjet")
        );
      `);

      if (!projets.length) {
        console.info(
          'ℹ️ Aucun projet lauréat avec une typologie précisée (détail de sa candidature) non migrée',
        );
        process.exit(0);
      }

      stats.total = projets.length;

      let count = 0;

      for (const { identifiantProjet, typologieDeProjet } of projets) {
        count++;
        process.stdout.write(`\r⏳ [${count}/${stats.total}]`);

        const typologieInstallation = getTypologieInstallation(typologieDeProjet);

        if (!typologieInstallation) {
          stats.errors.push({
            identifiantProjet,
            message:
              "⏭️ La typologie d'installation n'existe pas ou n'est pas migrable pour le projet",
          });
          console.log(
            `⏭️ La typologie d'installation n'existe pas ou n'est pas migrable pour le projet`,
          );
          continue;
        }

        try {
          const event: Lauréat.Installation.InstallationImportéeEvent = {
            type: 'InstallationImportée-V1',
            payload: {
              identifiantProjet,
              installateur: '',
              typologieInstallation: [
                {
                  typologie: typologieInstallation,
                },
              ],
              importéeLe: DateTime.now().formatter(),
              importéePar: Email.système.formatter(),
            },
          };

          await publish(`installation|${identifiantProjet}`, event);
          stats.sucess.push({
            identifiantProjet,
            valeurDétail: typologieDeProjet,
            valueTypologie: typologieInstallation,
          });
        } catch (error) {
          stats.errors.push({ identifiantProjet, message: error as string });
        }
      }

      console.info(`\n📊 Résultat :`);
      console.info(`  ✅ ${stats.sucess.length} projets migrés`);
      console.info(`  ❌ ${stats.errors.length} projets en erreur`);

      if (stats.sucess.length) {
        await writeFile(
          './typologieInstallation-success.csv',
          await ExportCSV.toCSV({
            data: stats.sucess,
            fields: [
              { label: 'Identifiant projet', value: 'identifiantProjet' },
              {
                label: 'Valeur détail candidature',
                value: 'valeurDétail',
              },
              {
                label: 'Typologie installation migrée',
                value: 'valueTypologie',
              },
            ],
          }),
          'utf-8',
        );
      }

      if (stats.errors.length) {
        await writeFile(
          './typologieInstallation-errors.csv',
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
    } catch (error) {
      console.error(error);
    }
  }
}
