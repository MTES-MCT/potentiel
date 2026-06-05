/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getScopeProjetUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';
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
      }>(`
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
          array_agg(jsonb_build_object(
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
      group by
        1,
        2,
        3,
        4,
        5;
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
        technologie,
        cdcModifiéLe,
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

          const idProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);

          const appelOffre = appelsOffreData.find((ao) => ao.id === idProjet.appelOffre)!;
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

          const datePostNotification =
            Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(dateNotification)
              .ajouterDélai(cahierDesCharges.getDélaiRéalisationEnMois())
              .dateTime.retirerNombreDeJours(1)
              .formatter();

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
          }

          if (délais && délais.length > 0) {
            /***
             * 4. Évènements Délai accordé
             */
            const sortedDélais = délais.sort((a, b) => {
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
