import { writeFile } from 'node:fs/promises';

import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getScopeProjetUtilisateurAdapter } from '@potentiel-infrastructure/domain-adapters';
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

const ECART_JOURS_TOLÉRANCE = 1;

const FICHIER_CORRESPONDANCES = './vérifier-données-achèvement_correspondances.csv';
const FICHIER_ÉCARTS = './vérifier-données-achèvement_écarts.csv';
const FICHIER_ERREURS = './vérifier-données-achèvement_erreurs.csv';

const envSchema = z.object({
  ...dbSchema.shape,
});

type LigneCommon = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateNotification: DateTime.RawType;
  datePrévisionnelleAttendue: DateTime.RawType;
  datePrévisionnelleActuelle: DateTime.RawType;
  écartJours: number;
};

type LigneErreur = {
  identifiantProjet: IdentifiantProjet.RawType;
  raison: string;
};

type Stats = {
  total: number;
  correspondances: Array<LigneCommon>;
  écarts: Array<LigneCommon>;
  erreurs: Array<LigneErreur>;
};

export class VérifierDonnéesAchèvementCommand extends Command {
  static override description =
    `Corriger les streams d'achèvement en s'assurant d'avoir en premier évènement un calcul de date prévisionnel post notification.
    ⚠️ On exclue volontairement les projets qui ont plusieurs évènements de calcul de date inconnu.
    Pour traiter ces cas, merci d'utiliser la commande dédiée. ⚠️`;

  async init() {
    envSchema.parse(process.env);

    AppelOffre.registerAppelOffreQueries({ find: findProjection, list: listProjection });

    Lauréat.registerLauréatQueries({
      find: findProjection,
      count: countProjection,
      getScopeProjetUtilisateur: getScopeProjetUtilisateurAdapter,
      list: listProjection,
      listHistory: listHistoryProjection,
    });
  }

  async run() {
    const stats: Stats = {
      total: 0,
      correspondances: [],
      écarts: [],
      erreurs: [],
    };

    const donnéesActuelles = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
      dateNotification: DateTime.RawType;
      cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.RawType;
      dateAchevementPrévisionnelStockée: DateTime.RawType;
      dateMiseEnService?: DateTime.RawType;
      délais: Array<Lauréat.Délai.DemandeDélaiEntity['nombreDeMois']>;
    }>(`
      select laur.value->>'identifiantProjet' as "identifiantProjet",
        laur.value->>'notifiéLe' as "dateNotification",
        laur.value->>'cahierDesCharges' as "cahierDesCharges",
        ach.value->>'prévisionnel.date' as "dateAchevementPrévisionnelStockée",
        racc.value->>'miseEnService.date' as "dateMiseEnService",
        array_agg(CAST(delai.value->>'nombreDeMois' AS INTEGER)) FILTER (WHERE delai.value->>'nombreDeMois' IS NOT NULL) as "délais"
      from domain_views.projection as laur
      inner join domain_views.projection as ach on ach.key = format(
        'achèvement|%s',
        laur.value->>'identifiantProjet'
      )
      left join domain_views.projection as racc on racc.key = format(
        'raccordement|%s',
        laur.value->>'identifiantProjet'
      )
      left join domain_views.projection as delai on delai.key like 'demande-délai|%'
      and delai.value->>'identifiantProjet' = laur.value->>'identifiantProjet'
      and delai.value->>'statut' = 'accordé'
      group by 1,
        2,
        3,
        4,
        5;
  `);

    if (!donnéesActuelles.length) {
      throw new Error('Aucune donnée actuelle récupérée pour les projets');
    }

    stats.total = donnéesActuelles.length;
    console.log(`ℹ️ ${stats.total} projets concernés`);

    const projetsAvecEventCovid = await executeSelect<{
      identifiantProjet: IdentifiantProjet.RawType;
    }>(`
      select
        payload->>'identifiantProjet' as "identifiantProjet"
        from event_store.event_stream
        where stream_id  like 'achevement|%'
        and payload->>'raison' = 'covid'
      `);

    console.info(
      `ℹ️ ${projetsAvecEventCovid.length} projets ont bénéficié d'un délai supplémentaire covid`,
    );

    let compteur = 0;
    for (const {
      identifiantProjet,
      dateNotification,
      dateAchevementPrévisionnelStockée,
      cahierDesCharges,
      dateMiseEnService,
      délais,
    } of donnéesActuelles) {
      compteur++;
      process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

      try {
        let datePrévisionnelAttendue: DateTime.RawType | undefined;

        const { appelOffre } = IdentifiantProjet.convertirEnValueType(identifiantProjet);
        const DUREE_INSTRUCTION_EDF_OA_EN_JOURS = 1;

        const ao = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
          type: 'AppelOffre.Query.ConsulterAppelOffre',
          data: {
            identifiantAppelOffre: appelOffre,
          },
        });

        if (Option.isNone(ao)) {
          stats.erreurs.push({
            identifiantProjet,
            raison: `Appel d'offre non trouvé`,
          });
          continue;
        }

        const cahierDesChargesValueType =
          await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
            type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
            data: {
              identifiantProjetValue: identifiantProjet,
            },
          });

        if (Option.isNone(cahierDesChargesValueType)) {
          stats.erreurs.push({
            identifiantProjet,
            raison: `Impossible de récupérer le CDC`,
          });
          continue;
        }

        /*
         * 1. Calcul de la date prévisionnel post notification
         */

        const calculDatePrévisionnelPostNotification =
          Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(dateNotification)
            .ajouterDélai(cahierDesChargesValueType.getDélaiRéalisationEnMois())
            .dateTime.retirerNombreDeJours(DUREE_INSTRUCTION_EDF_OA_EN_JOURS)
            .formatter();

        datePrévisionnelAttendue = calculDatePrévisionnelPostNotification;

        /**
         * 2. Calcul délai covid
         */
        const projetConcernéParDélaiCovid = projetsAvecEventCovid.some(
          (event) => event.identifiantProjet === identifiantProjet,
        );

        if (projetConcernéParDélaiCovid) {
          const calculDatePrévisionnelPostCovid = DateTime.convertirEnValueType(
            datePrévisionnelAttendue,
          )
            .ajouterNombreDeMois(7)
            .formatter();

          datePrévisionnelAttendue = calculDatePrévisionnelPostCovid;
        }

        /**
         * 3. Calcul choix CDC avec délai applicable
         */
        if (
          AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
            cahierDesCharges,
          ).estCDC2022() &&
          dateMiseEnService &&
          cahierDesChargesValueType.cahierDesChargesModificatif?.délaiApplicable
            ?.intervaleDateMiseEnService
        ) {
          const { min, max } =
            cahierDesChargesValueType.cahierDesChargesModificatif.délaiApplicable
              .intervaleDateMiseEnService;

          const dateMiseEnServiceValueType = DateTime.convertirEnValueType(dateMiseEnService);

          if (
            dateMiseEnServiceValueType.estDansIntervalle({
              min: DateTime.convertirEnValueType(min),
              max: DateTime.convertirEnValueType(max),
            })
          ) {
            const calculDatePrévisionnelPostChoixCDCAvecDélaiApplicable =
              DateTime.convertirEnValueType(datePrévisionnelAttendue)
                .ajouterNombreDeMois(
                  cahierDesChargesValueType.cahierDesChargesModificatif.délaiApplicable.délaiEnMois,
                )
                .formatter();

            datePrévisionnelAttendue = calculDatePrévisionnelPostChoixCDCAvecDélaiApplicable;
          }
        }

        /**
         * 4. Délai accordés
         */
        let cumulMois = 0;

        for (const nombreDeMois of délais ?? []) {
          cumulMois += nombreDeMois;
        }

        if (cumulMois > 0) {
          const calculDatePrévisionnelPostAjoutDélaisExceptionnel = DateTime.convertirEnValueType(
            datePrévisionnelAttendue,
          )
            .ajouterNombreDeMois(cumulMois)
            .formatter();

          datePrévisionnelAttendue = calculDatePrévisionnelPostAjoutDélaisExceptionnel;
        }

        if (!dateAchevementPrévisionnelStockée) {
          stats.erreurs.push({
            identifiantProjet,
            raison: `Date d'achèvement prévisionnelle stockée manquante`,
          });
          continue;
        }

        const écartJours = DateTime.convertirEnValueType(
          dateAchevementPrévisionnelStockée,
        ).nombreJoursÉcartAvec(DateTime.convertirEnValueType(datePrévisionnelAttendue));

        if (écartJours <= ECART_JOURS_TOLÉRANCE) {
          stats.correspondances.push({
            identifiantProjet,
            dateNotification,
            datePrévisionnelleAttendue: datePrévisionnelAttendue,
            datePrévisionnelleActuelle: dateAchevementPrévisionnelStockée,
            écartJours,
          });
        } else {
          stats.écarts.push({
            identifiantProjet,
            dateNotification,
            datePrévisionnelleAttendue: datePrévisionnelAttendue,
            datePrévisionnelleActuelle: dateAchevementPrévisionnelStockée,
            écartJours,
          });
        }
      } catch (error) {
        stats.erreurs.push({
          identifiantProjet,
          raison: error instanceof Error ? error.message : String(error),
        });
      }
    }

    process.stdout.write('\n');

    console.info(`\n📊 Résultat :`);
    console.info(
      `  ✅ ${stats.correspondances.length} projets avec date correcte (écart ≤ ${ECART_JOURS_TOLÉRANCE} jour)`,
    );
    console.info(`  ⚠️  ${stats.écarts.length} projets avec écart de date`);
    console.info(`  ❌ ${stats.erreurs.length} projets en erreur`);

    const fields: Array<{
      label: string;
      value: keyof LigneCommon;
    }> = [
      { label: 'Identifiant projet', value: 'identifiantProjet' },
      { label: 'Date de notifiation', value: 'dateNotification' },
      { label: 'Date prévisionnelle attendue', value: 'datePrévisionnelleAttendue' },
      { label: 'Date prévisionnelle actuelle', value: 'datePrévisionnelleActuelle' },
      { label: 'Écart jours', value: 'écartJours' },
    ];

    if (stats.correspondances.length) {
      await writeFile(
        FICHIER_CORRESPONDANCES,
        await ExportCSV.toCSV({
          data: stats.correspondances,
          fields,
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des correspondances écrit dans ${FICHIER_CORRESPONDANCES}`);
    }

    if (stats.écarts.length) {
      await writeFile(
        FICHIER_ÉCARTS,
        await ExportCSV.toCSV({
          data: stats.écarts,
          fields,
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des écarts écrit dans ${FICHIER_ÉCARTS}`);
    }

    if (stats.erreurs.length) {
      await writeFile(
        FICHIER_ERREURS,
        await ExportCSV.toCSV({
          data: stats.erreurs,
          fields: [
            { label: 'Identifiant projet', value: 'identifiantProjet' },
            { label: 'Raison', value: 'raison' },
          ],
        }),
        'utf-8',
      );
      console.info(`\n📄 Rapport des erreurs écrit dans ${FICHIER_ERREURS}`);
    }
  }
}
