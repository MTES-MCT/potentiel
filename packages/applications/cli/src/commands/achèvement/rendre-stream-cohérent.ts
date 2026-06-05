import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import {
  getScopeProjetUtilisateurAdapter,
  ProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { ExportCSV } from '@potentiel-libraries/csv';
import { Option } from '@potentiel-libraries/monads';
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

type AchèvementEventStream = Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent & {
  created_at: DateTime.RawType;
  version: number;
};

export class RendreStreamAchèvementCohérentCommand extends Command {
  static override description =
    `Ce script a pour objectif de remplacer les évènements "DatePrévisionnelleCalculée-V1" pour insérer les évènements au bon moment du cycle de vie des projets`;

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
    try {
      const projets = await executeSelect<{
        identifiantProjet: IdentifiantProjet.RawType;
        dateNotification: DateTime.RawType;
        référenceCahierDesChargesActuel: AppelOffre.RéférenceCahierDesCharges.RawType;
        datesMiseEnService?: {
          dateMiseEnService: DateTime.RawType;
          transmiseLe: DateTime.RawType;
        }[];
        avecEventCovid: boolean;
        délais?: {
          nombreDeMois: string;
          accordéLe: DateTime.RawType;
        }[];
      }>(`
      select 
        laur.value->>'identifiantProjet' as "identifiantProjet",
          laur.value->>'notifiéLe' as "dateNotification",
          laur.value->>'cahierDesCharges' as "référenceCahierDesChargesActuel",
          (covid.payload IS NOT NULL) as "avecEventCovid",
          array_agg(distinct jsonb_build_object(
            'dateMiseEnService', racc.payload->>'dateMiseEnService',
            'transmiseLe', racc.created_at
          ))
            FILTER (WHERE racc.payload->>'dateMiseEnService' IS NOT NULL) as "datesMiseEnService",
          array_agg(jsonb_build_object(
            'nombreDeMois', delai.value->>'accord.nombreDeMois',
            'accordéLe', delai.value->>'accord.accordéeLe'
          ))
            FILTER (WHERE delai.value IS NOT NULL) as "délais"
      from
        domain_views.projection as laur
      inner join
        domain_views.projection as ach on ach.key = format(
            'achèvement|%s',
            laur.value->>'identifiantProjet'
          )
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
      group by
        1,
        2,
        3,
        4;
    `);

      if (!projets.length) {
        throw new Error('❌ Aucun projet concernés');
      }

      const stats: Stats = {
        total: projets.length,
        success: [],
        errors: [],
      };

      console.info(`ℹ️ ${stats.total} projets à traiter`);

      let count = 0;

      for (const {
        identifiantProjet,
        dateNotification,
        référenceCahierDesChargesActuel,
        datesMiseEnService,
        avecEventCovid,
        délais,
      } of projets) {
        try {
          count++;
          process.stdout.write(`\r⏳ [${count}/${stats.total}]`);

          const events: Omit<AchèvementEventStream, 'version'>[] = [];

          let dateAchèvementPrévisionnelFinale: DateTime.RawType;

          /**
           * 1. Évènement suite à la notification du projet
           */
          const projet = await ProjetAdapter.getProjetAggregateRootAdapter(
            IdentifiantProjet.convertirEnValueType(identifiantProjet),
          );

          const datePostNotification =
            await projet.lauréat.achèvement.getDateAchèvementPrévisionnelCalculée({
              type: 'notification',
            });

          events.push({
            type: 'DateAchèvementPrévisionnelCalculée-V1',
            created_at: dateNotification,
            payload: {
              identifiantProjet,
              date: datePostNotification,
              raison: 'notification',
            },
          });

          dateAchèvementPrévisionnelFinale = datePostNotification;

          if (avecEventCovid) {
            /**
             * 2. Évènement covid
             */
            const datePostCovid = DateTime.convertirEnValueType(dateAchèvementPrévisionnelFinale)
              .ajouterNombreDeMois(7)
              .formatter();

            events.push({
              type: 'DateAchèvementPrévisionnelCalculée-V1',
              created_at: '2020-09-25T12:00:00.000Z',
              payload: {
                identifiantProjet,
                date: datePostCovid,
                raison: 'covid',
              },
            });

            dateAchèvementPrévisionnelFinale = datePostCovid;
          }

          if (datesMiseEnService && datesMiseEnService.length > 0) {
            /**
             * 3. Évènement CDC 30/08/2022 dépendant de la mise en service du projet
             */
            const estÉligibleAux18mois = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
              référenceCahierDesChargesActuel,
            ).estCDC2022();

            const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
              type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
              data: {
                identifiantProjetValue: identifiantProjet,
              },
            });

            if (Option.isNone(cahierDesCharges)) {
              const message = `Impossible de récupérer le CDC`;
              console.warn(`\n⚠️ [${identifiantProjet}] ${message}`);
              stats.errors.push({ identifiantProjet, message });
              continue;
            }

            const délaiApplicable = cahierDesCharges.cahierDesChargesModificatif?.délaiApplicable;

            if (estÉligibleAux18mois && délaiApplicable) {
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
              if (datesMiseServiceDansInterval.length === 0) {
                continue;
              }

              const dateMiseEnServiceLaPlusAncienne =
                datesMiseServiceDansInterval.length === 1
                  ? datesMiseServiceDansInterval[0]
                  : datesMiseServiceDansInterval.sort((a, b) => {
                      const aDate = DateTime.convertirEnValueType(a.dateMiseEnService);
                      const bDate = DateTime.convertirEnValueType(b.dateMiseEnService);
                      if (aDate.estAntérieurÀ(bDate)) return -1;
                      if (bDate.estAntérieurÀ(aDate)) return 1;
                      return 0;
                    })[0];

              const eventModificationCdc = await executeSelect<{
                date: DateTime.RawType;
              }>(
                `
              select 
                payload->>'modifiéLe' as date
              from 
                event_store.event_stream es 
              where 
                stream_id = 'lauréat|' || $1
                and type = 'CahierDesChargesChoisi-V1'
                and payload->>'cahierDesCharges' = '30/08/2022'
              order by payload->>'modifiéLe' desc
              limit 1
            `,
                identifiantProjet,
              );

              if (!eventModificationCdc[0]?.date) {
                const message =
                  'Impossible de récupérer la date de modification du CDC en 30/08/2022 la plus récente';
                console.warn(`\n⚠️ [${identifiantProjet}] ${message}`);
                stats.errors.push({ identifiantProjet, message });
                continue;
              }

              const dateQuiAProvoquéLes18Mois = DateTime.convertirEnValueType(
                dateMiseEnServiceLaPlusAncienne.transmiseLe,
              ).estUltérieureÀ(DateTime.convertirEnValueType(eventModificationCdc[0].date))
                ? dateMiseEnServiceLaPlusAncienne.transmiseLe
                : eventModificationCdc[0].date;

              const datePostChoixCdc = DateTime.convertirEnValueType(
                dateAchèvementPrévisionnelFinale,
              )
                .ajouterNombreDeMois(délaiApplicable.délaiEnMois)
                .formatter();

              events.push({
                type: 'DateAchèvementPrévisionnelCalculée-V1',
                created_at: dateQuiAProvoquéLes18Mois,
                payload: {
                  identifiantProjet,
                  date: datePostChoixCdc,
                  raison: 'ajout-délai-cdc-30_08_2022',
                },
              });

              dateAchèvementPrévisionnelFinale = datePostChoixCdc;
            }
          }

          if (délais && délais.length > 0) {
            /***
             * 4. Évènements Délai accordé
             */
            const sortedDélais =
              délais.length === 1
                ? délais
                : délais.sort((a, b) => {
                    const aDate = DateTime.convertirEnValueType(a.accordéLe);
                    const bDate = DateTime.convertirEnValueType(b.accordéLe);
                    if (aDate.estAntérieurÀ(bDate)) return -1;
                    if (bDate.estAntérieurÀ(aDate)) return 1;
                    return 0;
                  });

            for (const délai of sortedDélais) {
              const datePostDélaiAccordé = DateTime.convertirEnValueType(
                dateAchèvementPrévisionnelFinale,
              )
                .ajouterNombreDeMois(Number(délai.nombreDeMois))
                .formatter();

              events.push({
                type: 'DateAchèvementPrévisionnelCalculée-V1',
                created_at: délai.accordéLe,
                payload: {
                  identifiantProjet,
                  date: datePostDélaiAccordé,
                  raison: 'délai-accordé',
                },
              });

              dateAchèvementPrévisionnelFinale = datePostDélaiAccordé;
            }
          }

          stats.success.push({ identifiantProjet, dateAchèvementPrévisionnelFinale });
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
    } catch (error) {
      console.error(error);
    }
  }
}
