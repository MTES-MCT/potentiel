import { writeFile } from 'node:fs/promises';

import { Args, Command, Flags } from '@oclif/core';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getScopeProjetUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { ExportCSV } from '@potentiel-libraries/csv';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

type Stats = {
  total: number;
  success: {
    identifiantProjet: IdentifiantProjet.RawType;
    dateAchèvementPrévisionnelFinale: DateTime.RawType;
  }[];
  errors: { identifiantProjet: IdentifiantProjet.RawType; message: string }[];
};

type AchèvementEventStream = Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent;

export class RendreStreamAchèvementCohérentCommand extends Command {
  static override description =
    `Ce script a pour objectif de remplacer les évènements "DatePrévisionnelleCalculée-V1" pour insérer les évènements au bon moment du cycle de vie des projets`;

  static override flags = {
    dryRun: Flags.boolean({ name: 'dryRun' }),
  };
  static override args = {
    identifiantProjet: Args.string({
      name: 'identifiantProjet',
      description: "L'identifiant du projet à traiter (ex: 'Eolien#1##1')",
      required: false,
      multiple: true,
    }),
  };

  async init() {
    envSchema.parse(process.env);

    Lauréat.registerLauréatQueries({
      find: findProjection,
      count: countProjection,
      getScopeProjetUtilisateur: getScopeProjetUtilisateurAdapter,
      list: listProjection,
      listHistory: listHistoryProjection,
    });
  }

  async run() {
    const { flags, args } = await this.parse(RendreStreamAchèvementCohérentCommand);
    try {
      const projets = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        dateNotification: DateTime.RawType;
        référenceCahierDesChargesActuel: AppelOffre.RéférenceCahierDesCharges.RawType;
        technologie: AppelOffre.Technologie;
        cdcModifiéLe?: DateTime.RawType;
        datesMiseEnService?: {
          dateMiseEnService: DateTime.RawType;
          transmiseLe: DateTime.RawType;
        }[];
        avecEventCovid: boolean;
        délais?: {
          nombreDeMois: string;
          accordéLe: DateTime.RawType;
        }[];
      }>(
        `
      select 
        laur.value->>'identifiantProjet' as "identifiantProjet",
          laur.value->>'notifiéLe' as "dateNotification",
          laur.value->>'cahierDesCharges' as "référenceCahierDesChargesActuel",
          (covid.payload IS NOT NULL) as "avecEventCovid",
          cand.value->>'technologieCalculée' as "technologie",
          MAX(cdc.payload->>'modifiéLe') as "cdcModifiéLe",
          array_agg(distinct jsonb_build_object(
            'dateMiseEnService', racc.payload->>'dateMiseEnService',
            'transmiseLe', COALESCE(racc.payload->>'transmiseLe', racc.created_at)
          ))
            FILTER (WHERE racc.payload->>'dateMiseEnService' IS NOT NULL) as "datesMiseEnService",
          array_agg(distinct jsonb_build_object(
            'nombreDeMois', delai.value->>'accord.nombreDeMois',
            'accordéLe', delai.value->>'accord.accordéeLe'
          ))
            FILTER (WHERE delai.value IS NOT NULL) as "délais"
      from
        domain_views.projection as laur
      inner join
        domain_views.projection as cand on cand.key = format(
          'candidature|%s',
          laur.value->>'identifiantProjet'
      )
      inner join
        domain_views.projection as ach on ach.key = format(
            'achèvement|%s',
            laur.value->>'identifiantProjet'
          )
      left join
        event_store.event_stream as cdc on cdc.stream_id = format(
          'lauréat|%s', 
          laur.value->>'identifiantProjet'
        ) 
        and type = 'CahierDesChargesChoisi-V1'
      left join
        event_store.event_stream as racc on racc.stream_id = format(
          'raccordement|%s', 
          laur.value->>'identifiantProjet'
        ) 
        and racc.type like 'DateMiseEnServiceTransmise-V%'
      left join
        domain_views.projection as delai on delai.key like 'demande-délai|%'
        and delai.value->>'identifiantProjet' = laur.value->>'identifiantProjet'
        and delai.value->>'statut' = 'accordé'
      left join 
        event_store.event_stream as covid on covid.stream_id = format(
          'achevement|%s', 
          laur.value->>'identifiantProjet'
        )
        and covid.type = 'DateAchèvementPrévisionnelCalculée-V1' 
        and covid.payload->>'raison' = 'covid'
      where 
        laur.key like 'lauréat|%'
        and (array_length($1::text[], 1) is null or laur.value->>'identifiantProjet' = ANY($1))
      group by 1, 2, 3, 4, 5;
    `,
        args.identifiantProjet ?? [],
      );

      if (!projets.length) {
        throw new Error('❌ Aucun projet concernés');
      }

      const stats: Stats = {
        total: projets.length,
        success: [],
        errors: [],
      };

      console.info(`ℹ️  ${stats.total} projets à traiter`);

      let count = 0;
      const all_events: AchèvementEventStream[] = [];

      for (const {
        identifiantProjet,
        dateNotification,
        référenceCahierDesChargesActuel,
        technologie,
        cdcModifiéLe,
        datesMiseEnService,
        avecEventCovid,
        délais,
      } of projets) {
        try {
          count++;
          process.stdout.write(`\r⏳ [${count}/${stats.total}]`);

          const events: AchèvementEventStream[] = [];

          let dateAchèvementPrévisionnelFinale: DateTime.ValueType;
          const idProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
          /** biome-ignore lint/style/noNonNullAssertion: static data*/
          const appelOffre = appelsOffreData.find((ao) => ao.id === idProjet.appelOffre)!;
          /** biome-ignore lint/style/noNonNullAssertion: static data*/
          const période = appelOffre.periodes.find((p) => p.id === idProjet.période)!;

          const cahierDesChargesChoisi = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
            référenceCahierDesChargesActuel,
          );

          const cahierDesChargesModificatif = période.cahiersDesChargesModifiésDisponibles.find(
            (c) => cahierDesChargesChoisi.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
          );

          const cahierDesCharges = CahierDesCharges.bind({
            appelOffre,
            période,
            technologie,
            cahierDesChargesModificatif,
            famille: undefined,
          });

          /**
           * 1. Évènement suite à la notification du projet
           */
          const datePostNotification = calculerNouvelleDateAchèvement(
            DateTime.convertirEnValueType(dateNotification),
            cahierDesCharges.getDélaiRéalisationEnMois(),
          ).retirerNombreDeJours(1);

          events.push({
            type: 'DateAchèvementPrévisionnelCalculée-V1',
            payload: {
              identifiantProjet,
              date: datePostNotification.formatter(),
              calculéeLe: addMilliseconds(dateNotification, 1),
              raison: 'notification',
            },
          });

          dateAchèvementPrévisionnelFinale = datePostNotification;

          /**
           * 2. Évènement covid
           */
          if (avecEventCovid) {
            const datePostCovid = calculerNouvelleDateAchèvement(
              dateAchèvementPrévisionnelFinale,
              7,
            );

            events.push({
              type: 'DateAchèvementPrévisionnelCalculée-V1',
              payload: {
                calculéeLe: '2020-09-25T12:00:00.000Z',
                identifiantProjet,
                date: datePostCovid.formatter(),
                raison: 'covid',
              },
            });

            dateAchèvementPrévisionnelFinale = datePostCovid;
          }

          /**
           * 3. Évènement CDC 30/08/2022 dépendant de la mise en service du projet
           */
          if (datesMiseEnService && datesMiseEnService.length > 0) {
            const délaiApplicable = cahierDesCharges.cahierDesChargesModificatif?.délaiApplicable;

            if (cahierDesChargesChoisi.estCDC2022() && délaiApplicable) {
              const datesMiseServiceDansInterval = datesMiseEnService.filter(
                ({ dateMiseEnService }) =>
                  DateTime.convertirEnValueType(dateMiseEnService).estDansIntervalle({
                    min: DateTime.convertirEnValueType(
                      délaiApplicable.intervaleDateMiseEnService.min,
                    ),
                    max: DateTime.convertirEnValueType(
                      délaiApplicable.intervaleDateMiseEnService.max,
                    ),
                  }),
              );

              /*
               * Si pas de date de mise en service, le projet n'est pas concerné par l'attribution des 18 mois
               * donc on peut skip
               */
              if (datesMiseServiceDansInterval.length > 0 && cdcModifiéLe) {
                const dateMiseEnServiceLaPlusAncienne = datesMiseServiceDansInterval.sort(
                  (a, b) => {
                    const aDate = DateTime.convertirEnValueType(a.dateMiseEnService);
                    const bDate = DateTime.convertirEnValueType(b.dateMiseEnService);
                    if (aDate.estAntérieurÀ(bDate)) return -1;
                    if (bDate.estAntérieurÀ(aDate)) return 1;
                    return 0;
                  },
                )[0];

                const dateQuiAProvoquéLes18Mois = DateTime.convertirEnValueType(
                  dateMiseEnServiceLaPlusAncienne.transmiseLe,
                ).estUltérieureÀ(DateTime.convertirEnValueType(cdcModifiéLe))
                  ? dateMiseEnServiceLaPlusAncienne.transmiseLe
                  : cdcModifiéLe;

                const datePostChoixCdc = calculerNouvelleDateAchèvement(
                  dateAchèvementPrévisionnelFinale,
                  délaiApplicable.délaiEnMois,
                );

                events.push({
                  type: 'DateAchèvementPrévisionnelCalculée-V1',
                  payload: {
                    identifiantProjet,
                    calculéeLe: addMilliseconds(dateQuiAProvoquéLes18Mois, 1),
                    date: datePostChoixCdc.formatter(),
                    raison: 'ajout-délai-cdc-30_08_2022',
                  },
                });

                dateAchèvementPrévisionnelFinale = datePostChoixCdc;
              }
            }
          }

          /**
           * 4. Évènements Délai accordé
           */
          if (délais && délais.length > 0) {
            const sortedDélais = délais.sort((a, b) => {
              const aDate = DateTime.convertirEnValueType(a.accordéLe);
              const bDate = DateTime.convertirEnValueType(b.accordéLe);
              if (aDate.estAntérieurÀ(bDate)) return -1;
              if (bDate.estAntérieurÀ(aDate)) return 1;
              return 0;
            });

            for (const délai of sortedDélais) {
              const datePostDélaiAccordé = calculerNouvelleDateAchèvement(
                dateAchèvementPrévisionnelFinale,
                Number(délai.nombreDeMois),
              );

              events.push({
                type: 'DateAchèvementPrévisionnelCalculée-V1',
                payload: {
                  identifiantProjet,
                  date: datePostDélaiAccordé.formatter(),
                  calculéeLe: addMilliseconds(délai.accordéLe, 1),
                  raison: 'délai-accordé',
                },
              });

              dateAchèvementPrévisionnelFinale = datePostDélaiAccordé;
            }
          }

          stats.success.push({
            identifiantProjet,
            dateAchèvementPrévisionnelFinale: dateAchèvementPrévisionnelFinale.formatter(),
          });
          all_events.push(...events);
        } catch (error) {
          console.log(error);

          stats.errors.push({
            identifiantProjet,
            message: error as string,
          });
        }
      }

      process.stdout.write('\n');

      console.info(`\n📊 Résultat :`);
      console.info(`  ✅ ${stats.success.length} projets ont un nouveau event stream achèvement`);
      console.info(`  ❌ ${stats.errors.length} projets en erreur`);

      await this.logResultsToFile(stats);

      if (stats.success.length !== stats.total) {
        console.warn(
          "⚠️  Tous les projets n'ont pas été traités avec succès, les événements suivants n'ont pas été réinjectés dans le stream achèvement :",
        );
        return;
      }

      if (flags.dryRun) {
        console.info(
          `\n💾 [dry-run] ${all_events.length} events auraient été réinjectés dans le stream achèvement`,
        );
        // stats sur le nombre d'évènements par projet
        console.log(
          Object.entries(
            Object.groupBy(
              Object.values(Object.groupBy(all_events, (e) => e.payload.identifiantProjet)).map(
                (events) => events?.length,
              ),
              (length) => length ?? 0,
            ),
          )
            .map(
              ([nombreEvents, projets]) =>
                `  - ${projets?.length} projets ont ${nombreEvents} events`,
            )
            .join('\n'),
        );

        return;
      }

      console.info(
        '\n🎉 Tous les projets ont été traités avec succès, les événements vont être réinjectés dans le stream achèvement',
      );

      // Suppression des évènements existants
      console.info(`\n🧹 Suppression des événements existants dans le stream achèvement...`);
      await executeSelect(
        `
        delete from event_store.event_stream
        where stream_id like 'achevement|%'
          and type = 'DateAchèvementPrévisionnelCalculée-V1';
      `,
      );

      console.info(`🔄 Réinjection des événements dans le stream achèvement...`);
      count = 0;
      for (const event of all_events) {
        count++;
        process.stdout.write(`\r⏳ [${count}/${all_events.length}]`);
        await publish(`achevement|${event.payload.identifiantProjet}`, {
          ...event,
          created_at: event.payload.calculéeLe,
        });
      }
      console.info('\n✅ Migration terminée');
    } catch (error) {
      console.error(error);
    }
  }

  private async logResultsToFile(stats: Stats) {
    const FILE_SUCCESS = './rendre-stream-achèvement-cohérent_succès.csv';
    const FILE_ERRORS = './rendre-stream-achèvement-cohérent_erreurs.csv';

    if (stats.success.length) {
      await writeFile(
        FILE_SUCCESS,
        await ExportCSV.toCSV({
          data: stats.success,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            {
              label: 'Date achèvement prévisionnel finale',
              value: 'dateAchèvementPrévisionnelFinale',
            },
          ],
        }),
        'utf-8',
      );
    }

    if (stats.errors.length) {
      await writeFile(
        FILE_ERRORS,
        await ExportCSV.toCSV({
          data: stats.errors,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            { label: 'Raison', value: 'message' },
          ],
        }),
        'utf-8',
      );
    }
  }
}

const addMilliseconds = (date: Date | string, milliseconds: number): DateTime.RawType => {
  const newDate = new Date(date);
  newDate.setMilliseconds(newDate.getMilliseconds() + milliseconds);
  return DateTime.convertirEnValueType(newDate).formatter();
};

const calculerNouvelleDateAchèvement = (
  dateActuelle: DateTime.ValueType,
  nombreDeMoisÀAjouter: number,
): DateTime.ValueType =>
  dateActuelle
    // gestion des années bissextiles
    .ajouterNombreDeJours(1)
    .ajouterNombreDeMois(nombreDeMoisÀAjouter)
    .retirerNombreDeJours(1);
