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
  statut: 'succès ✅' | 'erreur ❌';
  raison:
    | 'Achèvement existant mais date identique'
    | 'Transmission de la date'
    | 'Identifiant projet invalide'
    | 'Date achèvement réel transmise inexistante'
    | 'Achèvement aggrégat inexistant'
    | 'Achèvement inexistant'
    | 'Correction date'
    | 'Opération métier impossible';
  dateAchèvementRéelTransmise: DateTime.RawType;
  dateMiseEnService?: DateTime.RawType;
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
};

export class VérifierTransmissionDateAchèvementRéelEDFOACommand extends Command {
  static override description =
    `Vérification des données envoyées pour l'historique de transmission des dates d'achèvement réel par EDF OA.
    Ici on va juste lire un fichier csv et valider les dates.`;

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
    };

    const schema = z.object({
      identifiantProjet: z.string(),
      dateEDFOA: z.string(),
    });

    const { parsedData: projets } = await parseCsvFile(flags.path, schema);

    if (!projets.length) {
      throw new Error(`Aucun projet n'a été transmis dans le fichie ${flags.path}`);
    }

    stats.total = projets.length;
    console.log(`ℹ️ ${stats.total} projets concernés`);

    let compteur = 0;

    for (const { identifiantProjet, dateEDFOA } of projets) {
      compteur++;
      process.stdout.write(`\r⏳ [${compteur}/${stats.total}]`);

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
              raison: 'Achèvement existant mais date identique',
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
            raison: 'Correction date',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle,
            écartEnJours: 0,
          });

          continue;
        }

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
            raison: 'Date achèvement réel transmise inexistante',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (AggregateNotFoundError.isAggregateNotFoundError(error as Error)) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Achèvement aggrégat inexistant',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
          continue;
        }

        if (OperationRejectedError.isOperationRejectedError(error as Error)) {
          stats.erreurs.push({
            identifiantProjet,
            statut: 'erreur ❌',
            raison: 'Opération métier impossible',
            dateAchèvementRéelTransmise,
            dateAchèvementRéelActuelle: undefined,
            écartEnJours: undefined,
          });
        }
      }
      process.stdout.write('\n');
    }

    const RESULT_FILE = 'file_results_stats.csv';

    console.info(`\n📊 Résultat (cf ${RESULT_FILE}):`);
    console.info(
      `  ✅ ${stats.succès.length} projets sont en succès suite à une tranmission ou date égale`,
    );
    console.info(`  ❌ ${stats.erreurs.length} projets en erreur`);

    if (!stats.succès.length && !stats.erreurs.length) {
      console.info('Aucune résultat à ajouter dans le fichier');
      return;
    }

    const fields: Array<{
      label: string;
      value: keyof CsvLine;
    }> = [
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

    const parRaisonPuisÉcart = (a: CsvLine, b: CsvLine) => {
      const parRaison = a.raison.localeCompare(b.raison);

      if (parRaison === 0 && a.raison === 'Correction date' && b.raison === 'Correction date') {
        return (b.écartEnJours ?? 0) - (a.écartEnJours ?? 0);
      }

      return parRaison;
    };

    await writeFile(
      RESULT_FILE,
      await ExportCSV.toCSV({
        data: [...stats.succès.sort(parRaisonPuisÉcart), ...stats.erreurs.sort(parRaisonPuisÉcart)],
        fields,
      }),
      'utf-8',
    );

    console.info(`\n📄 Le fichier ${RESULT_FILE} a bien été généré`);

    process.exit(0);
  }
}
