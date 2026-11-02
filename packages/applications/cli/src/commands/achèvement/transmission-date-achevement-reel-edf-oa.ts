import { writeFile } from 'node:fs/promises';

import { Command, Flags } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { DateTime, Email } from '@potentiel-domain/common';
import { AggregateNotFoundError, OperationRejectedError } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
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

import { dbSchema } from '#helpers';
import { parseCsvFile } from '#helpers/files';

const envSchema = z.object({
  ...dbSchema.shape,
});

type CsvLine = {
  identifiantProjet: string;
  statut: 'succès ✅' | 'erreur ❌' | 'vérification nécessaire 🔍';
  raison:
    | 'Correction de la date'
    | "Date d'achèvement identique"
    | 'Transmission de la date'
    | 'Identifiant projet invalide'
    | 'Date achèvement réel invalide'
    | 'Achèvement inexistant'
    | 'Opération métier impossible'
    | 'Projet abandonné'
    | 'Date achèvement avant date de notif du projet'
    | 'Nécessite une vérification métier'
    | 'Puissance inconnue sur potentiel'
    | 'Inconnue';
  errorMessage?: string;
  dateAchèvementRéelTransmise: DateTime.RawType;
  dateMiseEnService?: DateTime.RawType;
  puissancePotentiel?: number;
  puissanceEDFOA?: string;
} & (
  | {
      écartEnJours: number;
      dateAchèvementRéelActuelle: DateTime.RawType;
    }
  | { dateAchèvementRéelActuelle: undefined; écartEnJours: undefined }
);

type Stats = {
  total: number;
  succès: Array<CsvLine>;
  erreurs: Array<CsvLine>;
  àVérifierMétier: Array<CsvLine>;
};

type CompteParRaison = Partial<Record<CsvLine['raison'], number>>;

const afficherDétailParRaison = (lignes: Array<CsvLine>) => {
  const compteParRaison = lignes.reduce<CompteParRaison>((compte, { raison }) => {
    compte[raison] = (compte[raison] ?? 0) + 1;
    return compte;
  }, {});

  for (const [raison, nombre] of Object.entries(compteParRaison)) {
    console.info(`     - ${raison} : ${nombre}`);
  }
};

const projetIdÀExclure = [
  'CRE4 - Sol#2#2#9',
  'CRE4 - Sol#2#2#9',
  'CRE4 - Sol#2#2#9',
  'CRE4 - Sol#2#2#9',
  'CRE4 - Sol#2#2#8',
  'CRE4 - Bâtiment#9#1#354',
  'CRE4 - Bâtiment#5#2#14',
  'CRE4 - Autoconsommation métropole#1##154',
  'CRE4 - Autoconsommation métropole 2016#1##1',
  'Eolien#1##27',
  'Eolien#2##9',
  'Eolien#1##36',
  'Eolien#1##17',
  'CRE4 - Autoconsommation métropole#1##51',
  'CRE4 - Autoconsommation métropole#3##12',
  'Eolien#1##8',
  'Eolien#4##21',
  'CRE4 - Autoconsommation métropole#1##160',
  'CRE4 - Autoconsommation métropole 2016#1##222',
  'CRE4 - Innovation#1#2#13',
  'CRE4 - Innovation#1#2#13',
  'CRE4 - Innovation#2#1#17',
  'Eolien#3##36',
  'CRE4 - Autoconsommation métropole#1##131',
  'Eolien#5##18',
  'Eolien#5##17',
  'Eolien#5##32',
  'Eolien#4##31',
  'CRE4 - Autoconsommation métropole 2016#2##156',
  'CRE4 - Autoconsommation métropole#4##16',
  'CRE4 - Autoconsommation métropole#6##45',
  'CRE4 - Autoconsommation métropole 2016#1##27',
  'PV - Eolien#1##4',
  'CRE4 - Autoconsommation métropole 2016#1##43',
  'CRE4 - Autoconsommation métropole 2016#1##20',
  'CRE4 - Autoconsommation métropole 2016#2##106',
  'Eolien#5##58',
  'Eolien#1##29',
  'CRE4 - Autoconsommation métropole#6##74',
  'Eolien#7##43',
  'CRE4 - Autoconsommation métropole#5##37',
  'CRE4 - Autoconsommation métropole#4##38',
  'Eolien#4##5',
  'Eolien#5##62',
  'Eolien#4##13',
  'Eolien#4##16',
  'CRE4 - Autoconsommation métropole#3##55',
  'CRE4 - Autoconsommation métropole#9##95',
  'CRE4 - Autoconsommation métropole#9##1',
  'CRE4 - Autoconsommation métropole#8##9',
  'CRE4 - Autoconsommation métropole#6##67',
  'CRE4 - Autoconsommation métropole#6##43',
  'CRE4 - Autoconsommation métropole#6##33',
  'PPE2 - Autoconsommation métropole#1##8',
  'PPE2 - Autoconsommation métropole#1##8',
  'PPE2 - Autoconsommation métropole#1##8',
  'PPE2 - Bâtiment#2##6',
  'Eolien#7##24',
  'PPE2 - EOLIEN#6##86',
  'PPE2 - Sol#3##61',
  'PPE2 - Bâtiment#3##24',
  'PPE2 - Sol#4##70',
  'PPE2 - Bâtiment#5##122',
  'PPE2 - Eolien#5##27',
  'PPE2 - Eolien#5##58',
  'PPE2 - Eolien#3##50',
  'PPE2 - Eolien#7##33',
  'CRE4 - Bâtiment#1#1#867',
  'CRE4 - Bâtiment#1#1#923',
  'CRE4 - Bâtiment#1#1#91',
  'CRE4 - Bâtiment#1#1#939',
  'CRE4 - Bâtiment#1#1#922',
  'CRE4 - Bâtiment#1#1#354',
  'CRE4 - Bâtiment#1#1#286',
  'CRE4 - Bâtiment#1#1#554',
  'CRE4 - Bâtiment#1#1#564',
  'CRE4 - Bâtiment#1#1#325',
  'CRE4 - Bâtiment#1#1#321',
  'CRE4 - Bâtiment#1#1#309',
  'CRE4 - Bâtiment#1#1#482',
  'CRE4 - Bâtiment#1#1#1032',
  'CRE4 - Bâtiment#1#1#653',
  'CRE4 - Bâtiment#1#1#631',
  'CRE4 - Bâtiment#1#1#262',
  'CRE4 - Bâtiment#1#1#307',
  'CRE4 - Bâtiment#1#1#271',
  'CRE4 - Bâtiment#1#1#976',
  'CRE4 - Bâtiment#1#1#258',
  'CRE4 - Bâtiment#1#1#275',
  'CRE4 - Bâtiment#1#1#274',
  'CRE4 - Bâtiment#1#1#1056',
  'CRE4 - Bâtiment#2#1#867',
  'CRE4 - Bâtiment#1#1#1025',
  'CRE4 - Bâtiment#2#1#468',
  'CRE4 - Bâtiment#1#1#31',
  'CRE4 - Bâtiment#2#1#909',
  'CRE4 - Bâtiment#2#1#321',
  'CRE4 - Bâtiment#1#1#77',
  'CRE4 - Bâtiment#2#1#547',
  'CRE4 - Bâtiment#1#1#936',
  'CRE4 - Bâtiment#3#1#469',
  'CRE4 - Bâtiment#1#1#1114',
  'CRE4 - Bâtiment#1#1#1005',
  'CRE4 - Bâtiment#1#1#96',
  'CRE4 - Bâtiment#1#1#189',
  'CRE4 - Bâtiment#1#1#147',
  'CRE4 - Bâtiment#1#1#123',
  'CRE4 - Bâtiment#1#1#355',
  'CRE4 - Bâtiment#1#1#880',
  'CRE4 - Bâtiment#2#1#218',
  'CRE4 - Bâtiment#1#1#1097',
  'CRE4 - Bâtiment#1#1#360',
  'CRE4 - Bâtiment#1#1#574',
  'CRE4 - Innovation#1#2#13',
  'CRE4 - Bâtiment#3#1#150',
  'CRE4 - Bâtiment#3#1#152',
  'CRE4 - Bâtiment#1#1#289',
  'CRE4 - Bâtiment#3#1#353',
  'CRE4 - Bâtiment#3#1#148',
  'CRE4 - Bâtiment#4#1#523',
  'CRE4 - Bâtiment#6#1#175',
  'CRE4 - Bâtiment#7#1#210',
  'CRE4 - Bâtiment#7#1#212',
  'CRE4 - Bâtiment#8#1#199',
  'CRE4 - Bâtiment#8#1#193',
  'CRE4 - Bâtiment#9#1#354',
  'CRE4 - Bâtiment#9#1#331',
  'CRE4 - Bâtiment#8#1#281',
  'CRE4 - Bâtiment#9#1#216',
  'CRE4 - Bâtiment#8#1#253',
  'CRE4 - Bâtiment#5#1#47',
  'CRE4 - Bâtiment#10#1#85',
  'CRE4 - Bâtiment#10#1#335',
  'CRE4 - Bâtiment#10#1#182',
  'CRE4 - Bâtiment#10#1#305',
  'CRE4 - Bâtiment#7#1#214',
  'CRE4 - Bâtiment#7#1#183',
  'CRE4 - Bâtiment#11#1#451',
  'CRE4 - Bâtiment#10#1#247',
  'CRE4 - Bâtiment#11#1#295',
  'CRE4 - Bâtiment#11#1#246',
  'CRE4 - Bâtiment#11#1#225',
  'CRE4 - Bâtiment#11#1#57',
  'CRE4 - Bâtiment#13#1#385',
  'CRE4 - Bâtiment#11#1#23',
  'CRE4 - Bâtiment#13#1#608',
  'CRE4 - Bâtiment#13#1#607',
  'CRE4 - Bâtiment#13#1#244',
  'CRE4 - Bâtiment#12#1#865',
  'CRE4 - Bâtiment#13#1#604',
  'CRE4 - Bâtiment#13#1#993',
  'CRE4 - Bâtiment#10#1#468',
  'CRE4 - Bâtiment#13#1#628',
  'CRE4 - Bâtiment#13#1#677',
  'CRE4 - Bâtiment#13#1#88',
  'CRE4 - Bâtiment#13#1#536',
  'CRE4 - Bâtiment#13#1#366',
  'CRE4 - Bâtiment#13#1#602',
  'CRE4 - Bâtiment#13#1#809',
  'CRE4 - Bâtiment#11#1#697',
];

export class VérifierTransmissionDateAchèvementRéelEDFOACommand extends Command {
  static override description =
    `Vérification des données envoyées pour l'historique de transmission des dates d'achèvement réel par EDF OA.`;

  static override flags = {
    path: Flags.file({
      exists: true,
      char: 'p',
      description: 'path to the csv file containing data to check',
      required: true,
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

    Lauréat.registerLauréatUseCases({
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
    });
  }

  async run() {
    const { flags } = await this.parse(VérifierTransmissionDateAchèvementRéelEDFOACommand);

    const stats: Stats = {
      total: 0,
      succès: [],
      erreurs: [],
      àVérifierMétier: [],
    };

    const schema = z.object({
      identifiantProjet: z.string(),
      dateEDFOA: z.string(),
      puissanceEDFOA: z.string(),
    });

    const { parsedData: projets } = await parseCsvFile(flags.path, schema);

    if (!projets.length) {
      throw new Error(`Aucun projet n'est à mettre à jour dans le fichier ${flags.path}`);
    }

    stats.total = projets.length;

    console.log(`ℹ️ ${stats.total} projets concernés par une mise à jour`);

    let compteur = 0;

    for (const { identifiantProjet, dateEDFOA, puissanceEDFOA } of projets) {
      compteur++;
      process.stdout.clearLine(0);
      process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

      if (projetIdÀExclure.includes(identifiantProjet)) {
        const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
          type: 'Lauréat.Puissance.Query.ConsulterPuissance',
          data: {
            identifiantProjet,
          },
        });

        if (Option.isNone(puissance)) {
          stats.àVérifierMétier.push({
            identifiantProjet,
            statut: 'vérification nécessaire 🔍',
            raison: 'Puissance inconnue sur potentiel',
            puissanceEDFOA,
            dateAchèvementRéelActuelle: undefined,
            dateAchèvementRéelTransmise: `${dateEDFOA.replace(' ', 'T')}Z}` as DateTime.RawType,
            écartEnJours: undefined,
          });
          continue;
        }

        const { puissance: puissancePotentiel } = puissance;

        stats.àVérifierMétier.push({
          identifiantProjet,
          statut: 'vérification nécessaire 🔍',
          raison: 'Nécessite une vérification métier',
          puissanceEDFOA,
          puissancePotentiel,
          dateAchèvementRéelActuelle: undefined,
          dateAchèvementRéelTransmise: dateEDFOA as DateTime.RawType,
          écartEnJours: undefined,
        });
        continue;
      }

      const dateEDFOAIsoString = dateEDFOA.length ? `${dateEDFOA.replace(' ', 'T')}Z` : '';

      let dateAchèvementRéelTransmise: DateTime.RawType = dateEDFOAIsoString as DateTime.RawType;

      try {
        const identifiantProjetValueType =
          IdentifiantProjet.convertirEnValueType(identifiantProjet);

        const dateAchèvementRéelTransmiseValueType =
          DateTime.convertirEnValueType(dateEDFOAIsoString);

        dateAchèvementRéelTransmise = dateAchèvementRéelTransmiseValueType.formatter();

        const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
          type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
          data: {
            identifiantProjetValue: identifiantProjetValueType.formatter(),
          },
        });

        if (Option.isNone(achèvement)) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Achèvement inexistant',
            dateAchèvementRéelTransmise: dateAchèvementRéelTransmiseValueType.formatter(),
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (achèvement.estAchevé) {
          const écartEnJours = achèvement.dateAchèvementRéel.nombreJoursÉcartAvec(
            dateAchèvementRéelTransmiseValueType,
          );

          const dateAchèvementRéelActuelle = achèvement.dateAchèvementRéel.formatter();

          if (écartEnJours === 0) {
            stats.succès.push({
              identifiantProjet,
              statut: 'succès ✅',
              raison: "Date d'achèvement identique",
              dateAchèvementRéelTransmise,
              dateAchèvementRéelActuelle,
              écartEnJours: 0,
            });
            continue;
          }

          await mediator.send<Lauréat.Achèvement.CorrigerDateAchèvementUseCase>({
            type: 'Lauréat.Achèvement.UseCase.CorrigerDateAchèvement',
            data: {
              identifiantProjetValue: identifiantProjetValueType.formatter(),
              dateAchèvementValue: dateAchèvementRéelTransmise,
              corrigéeLeValue: DateTime.now().formatter(),
              corrigéeParValue: Email.edfOa.formatter(),
            },
          });

          stats.succès.push({
            identifiantProjet,
            statut: 'succès ✅',
            raison: 'Correction de la date',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle,
            écartEnJours,
          });
        } else {
          await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
            type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
            data: {
              identifiantProjetValue: identifiantProjetValueType.formatter(),
              dateAchèvementValue: dateAchèvementRéelTransmise,
              transmiseLeValue: DateTime.now().formatter(),
              transmiseParValue: Email.edfOa.formatter(),
            },
          });

          stats.succès.push({
            identifiantProjet,
            statut: 'succès ✅',
            raison: 'Transmission de la date',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
        }
      } catch (error) {
        if (error instanceof IdentifiantProjet.IdentifiantProjetInvalideError) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Identifiant projet invalide',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (error instanceof DateTime.DateTimeInvalideError) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Date achèvement réel invalide',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (error instanceof Lauréat.Abandon.ProjetAbandonnéError) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Projet abandonné',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (error instanceof Lauréat.Achèvement.DateAchèvementAntérieureÀDateNotificationError) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Date achèvement avant date de notif du projet',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (
          AggregateNotFoundError.isAggregateNotFoundError(error as Error) ||
          OperationRejectedError.isOperationRejectedError(error as Error)
        ) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Opération métier impossible',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        console.log('ERREUR INCONNU', error);

        stats.erreurs.push({
          identifiantProjet,
          statut: 'erreur ❌',
          raison: 'Inconnue',
          errorMessage: error as string,
          dateAchèvementRéelTransmise,
          dateAchèvementRéelActuelle: undefined,
          écartEnJours: undefined,
        });
      }
    }

    const RESULT_SUCCESS_AND_ERRORS_FILE = 'file_results_stats_success_and_errors.csv';
    const RESULT_NEED_CHECK_FILE = 'file_results_stats_need_metier_validation.csv';

    console.info(`\n📊 Résultat (cf ${RESULT_SUCCESS_AND_ERRORS_FILE}):`);
    console.info(
      `  ✅ ${stats.succès.length} mises à jour réussies (transmission, correction ou date identique)`,
    );
    afficherDétailParRaison(stats.succès);
    console.info(`  ❌ ${stats.erreurs.length} mises à jour en échec`);
    afficherDétailParRaison(stats.erreurs);

    console.info(
      `  🕵🏻‍♂️ ${stats.àVérifierMétier.length} mises à jour nécessitant au préalable une validation métier`,
    );
    afficherDétailParRaison(stats.àVérifierMétier);

    if (!stats.succès.length && !stats.erreurs.length && !stats.àVérifierMétier.length) {
      console.info('Aucun résultat à ajouter au fichier');
      return;
    }

    type CsvField = {
      label: string;
      value: keyof CsvLine;
    };

    const fieldsSuccessAndErrors: Array<CsvField> = [
      {
        label: 'Identifiant Projet',
        value: 'identifiantProjet',
      },
      {
        label: 'Statut',
        value: 'statut',
      },
      {
        label: 'Raison',
        value: 'raison',
      },
      {
        label: 'Date Achèvement Réel EDF OA (transmise)',
        value: 'dateAchèvementRéelTransmise',
      },
      {
        label: 'Date mise en service du projet',
        value: 'dateMiseEnService',
      },
      {
        label: 'Date achèvement réel Potentiel (actuelle)',
        value: 'dateAchèvementRéelActuelle',
      },
      {
        label: 'Écart (jours)',
        value: 'écartEnJours',
      },
    ];

    await writeFile(
      RESULT_SUCCESS_AND_ERRORS_FILE,
      await ExportCSV.toCSV({
        data: [...stats.succès, ...stats.erreurs],
        fields: fieldsSuccessAndErrors,
      }),
      'utf-8',
    );

    console.info(`\n📄 Le fichier ${RESULT_SUCCESS_AND_ERRORS_FILE} a bien été généré`);

    if (!stats.àVérifierMétier.length) {
      return process.exit(0);
    }

    const fieldsNeedCheck: Array<CsvField> = [
      {
        label: 'Identifiant Projet',
        value: 'identifiantProjet',
      },
      {
        label: 'Statut',
        value: 'statut',
      },
      {
        label: 'Puissance EDFOA',
        value: 'puissanceEDFOA',
      },
    ];

    await writeFile(
      RESULT_NEED_CHECK_FILE,
      await ExportCSV.toCSV({
        data: stats.àVérifierMétier,
        fields: fieldsNeedCheck,
      }),
      'utf-8',
    );

    console.info(`\n📄 Le fichier ${RESULT_NEED_CHECK_FILE} a bien été généré`);

    process.exit(0);
  }
}
