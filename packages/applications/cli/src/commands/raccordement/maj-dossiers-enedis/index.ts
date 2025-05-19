import path from 'path';
import { access, constants, mkdir, rm, writeFile } from 'fs/promises';

import { mediator } from 'mediateur';
import { Command, Flags } from '@oclif/core';
import zod from 'zod';

import { Option } from '@potentiel-libraries/monads';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import {
  AppelOffreAdapter,
  DocumentAdapter,
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { killPool } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import {
  Raccordement,
  registerLauréatQueries,
  registerLauréatUseCases,
} from '@potentiel-domain/laureat';
import { DateTime, Email } from '@potentiel-domain/common';
import {
  ConsulterDocumentProjetQuery,
  registerDocumentProjetCommand,
  registerDocumentProjetQueries,
} from '@potentiel-domain/document';
import {
  loadAggregate,
  loadAggregateV2,
  publish,
} from '@potentiel-infrastructure/pg-event-sourcing';
import { IdentifiantProjet, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { registerTâcheCommand, Tâche } from '@potentiel-domain/tache';

import { parseCsvFile } from '../../../helpers/parse-file';

const envVariablesSchema = zod.object({
  // s3
  S3_BUCKET: zod.string({ message: 'S3_BUCKET is required' }),
  S3_ENDPOINT: zod.string({ message: 'S3_ENDPOINT is required' }),
  AWS_REGION: zod.string({ message: 'AWS_REGION is required' }),
  AWS_ACCESS_KEY_ID: zod.string({ message: 'AWS_ACCESS_KEY_ID is required' }),
  AWS_SECRET_ACCESS_KEY: zod.string({ message: 'AWS_SECRET_ACCESS_KEY is required' }),
  // Database
  DATABASE_CONNECTION_STRING: zod.string({ message: 'DATABASE_CONNECTION_STRING is required' }),
  // File path
  FILE_PATH: zod.string({
    message: 'FILE_PATH is required',
  }),
});

export class MajDossiersEnedis extends Command {
  static description =
    "Lire le contenu d'un fichier CSV rempli par Enedis pour venir (en one shot) créer / mettre à jour les dossiers de raccordement ainsi que la date de mise en service. Cette opération est ponctuelle";

  async init() {
    registerDocumentProjetCommand({
      enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
      déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
      archiverDocumentProjet: DocumentAdapter.archiverDocumentProjet,
    });
    registerDocumentProjetQueries({
      récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
    });
    registerLauréatQueries({
      count: countProjection,
      find: findProjection,
      list: listProjection,
      récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    });
    registerLauréatUseCases({
      loadAggregate,
      getProjetAggregateRoot: (identifiantProjet) =>
        ProjetAggregateRoot.get(identifiantProjet, {
          loadAggregate: loadAggregateV2,
          loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
        }),
      supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    });
    registerTâcheCommand({
      loadAggregate,
    });
    await deleteFolderIfExists(path.resolve(__dirname, './logs'));
    await mkdir(path.resolve(__dirname, './logs'), { recursive: true });
  }

  static flags = {
    dryRun: Flags.boolean(),
  };

  async finally() {
    await killPool();
  }

  async run() {
    const { FILE_PATH } = envVariablesSchema.parse(process.env);

    const logger = getLogger(MajDossiersEnedis.name);

    logger.info('🏁 Début de la mise à jour des dossiers de raccordement');

    const csvSchema = zod.object({
      appelOffre: zod.string(),
      periode: zod.string(),
      famille: zod.string().optional(),
      numeroCRE: zod.string(),
      referenceDossier: zod.string().optional(),
      dateAccuseReception: zod.string().optional(),
      dateMiseEnService: zod.string().optional(),
    });

    const { parsedData } = await parseCsvFile(path.resolve(__dirname, FILE_PATH), csvSchema, {
      delimiter: ',',
      encoding: 'utf8',
    });

    if (parsedData.length === 0) {
      logger.error('❌ Aucune donnée à traiter ❌');
      process.exit(1);
    }

    const statistics = getStatistics(parsedData.length);

    let index = 1;

    for (const ligne of parsedData) {
      const identifiantProjet = `${ligne.appelOffre}#${ligne.periode}#${ligne.famille}#${ligne.numeroCRE}`;

      console.log(`Traitement du projet ${identifiantProjet} (${index} / ${parsedData.length})`);

      /**
       * Pas de référence de dossier renseignée
       */
      if (!ligne.referenceDossier) {
        statistics.ligneSansRéférenceDossier.push(identifiantProjet);
        index++;
        continue;
      }

      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      /**
       * Raccordement inexistant
       */
      if (Option.isNone(raccordement)) {
        console.error(
          `Aucun raccordement trouvé pour le projet ${identifiantProjet} (${ligne.referenceDossier})`,
        );
        statistics.projetSansRaccordement.push(identifiantProjet);
        index++;
        continue;
      }

      /**
       * Si plusieurs dossiers rattachés au raccordement du projet, on ne peut pas savoir duquel on parle ??
       */
      if (raccordement.dossiers.length > 1) {
        statistics.plusieursDossiersDeRaccordement.push({
          identifiantProjet,
          référenceFichier: ligne.referenceDossier,
          référencesActuelles: raccordement.dossiers.map((dossier) =>
            dossier.référence.formatter(),
          ),
        });
        index++;
        continue;
      }

      /**
       * Si il y a un dossier de raccordement
       */
      if (raccordement.dossiers.length === 1) {
        statistics.UnSeulDossierDeRaccordement.total++;

        const dossierRaccordement = raccordement.dossiers[0];

        /**
         * Si la référence du dossier de raccordement actuelle est "Référence non transmise"
         */
        if (
          dossierRaccordement.référence.estÉgaleÀ(
            Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
          )
        ) {
          try {
            await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
              type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
              data: {
                identifiantProjetValue: identifiantProjet,
                référenceDossierRaccordementActuelleValue:
                  dossierRaccordement.référence.formatter(),
                nouvelleRéférenceDossierRaccordementValue: ligne.referenceDossier,
                rôleValue: 'admin',
                modifiéeLeValue: DateTime.now().formatter(),
                modifiéeParValue: Email.system().formatter(),
              },
            });

            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.total++;
            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès.push(
              {
                identifiantProjet,
                référenceDossier: ligne.referenceDossier,
              },
            );
          } catch (error) {
            console.error(
              `Erreur lors de la mise à jour de la référence du dossier de raccordement pour le projet ${identifiantProjet} : ${error}`,
            );
            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.total++;
            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.erreurs.push(
              {
                identifiantProjet,
                référenceDossier: ligne.referenceDossier,
                erreur: error as string,
              },
            );
            index++;
            continue;
          }
        }

        /*
         * Si il y a une date de qualification et qu'elle est différente de l'existant
         */
        if (
          ligne.dateAccuseReception &&
          dossierRaccordement.demandeComplèteRaccordement.dateQualification &&
          !dossierRaccordement.demandeComplèteRaccordement.dateQualification.estÉgaleÀ(
            DateTime.convertirEnValueType(formatDateQualification(ligne.dateAccuseReception)),
          )
        ) {
          if (!dossierRaccordement.demandeComplèteRaccordement.accuséRéception) {
            const idProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter();

            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement
              .sansAccuséRéception.total++;

            try {
              const event: Raccordement.DemandeComplèteRaccordementModifiéeEventV2 = {
                type: 'DemandeComplèteRaccordementModifiée-V2',
                payload: {
                  identifiantProjet: idProjet,
                  référenceDossierRaccordement: dossierRaccordement.référence.formatter(),
                  dateQualification: DateTime.convertirEnValueType(
                    formatDateQualification(ligne.dateAccuseReception),
                  ).formatter(),
                },
              };

              await publish(
                `raccordement|${idProjet}#${dossierRaccordement.référence.formatter()}`,
                event,
              );

              statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.sansAccuséRéception.succès.push(
                {
                  identifiantProjet: idProjet,
                  dateQualification: ligne.dateAccuseReception,
                },
              );

              index++;
              continue;
            } catch (error) {
              statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.sansAccuséRéception.erreurs.push(
                {
                  identifiantProjet: idProjet,
                  dateQualification: ligne.dateAccuseReception,
                  erreur: `Erreur lors de la modification du dossier de raccordement existant sans accusé de réception : ${error}`,
                },
              );
              index++;
              continue;
            }
          }

          try {
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement
              .avecAccuséRéception.total++;

            /**
             * On récupère le fichier (accusé de réception) de la DCR
             */
            const document = await mediator.send<ConsulterDocumentProjetQuery>({
              type: 'Document.Query.ConsulterDocumentProjet',
              data: {
                documentKey:
                  dossierRaccordement.demandeComplèteRaccordement.accuséRéception.formatter(),
              },
            });

            if (Option.isNone(document)) {
              statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.avecAccuséRéception.erreurs.push(
                {
                  identifiantProjet,
                  dateQualification:
                    dossierRaccordement.demandeComplèteRaccordement.dateQualification.formatter(),
                  erreur: `Le dossier de raccordement ne dispose pas d'accusé de réception`,
                },
              );
              index++;
              continue;
            }

            await mediator.send<Raccordement.ModifierDemandeComplèteRaccordementUseCase>({
              type: 'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
              data: {
                identifiantProjetValue: identifiantProjet,
                référenceDossierRaccordementValue: ligne.referenceDossier,
                dateQualificationValue: formatDateQualification(ligne.dateAccuseReception),
                accuséRéceptionValue: document,
                // TODO : pas sur de ça
                rôleValue: 'admin',
              },
            });

            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement
              .avecAccuséRéception.total++;
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.avecAccuséRéception.succès.push(
              {
                identifiantProjet,
                dateQualification: ligne.dateAccuseReception,
              },
            );
          } catch (error) {
            console.error(
              `Erreur lors de la mise à jour de la demande complète de raccordement pour le projet ${identifiantProjet} : ${error}`,
            );
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement
              .avecAccuséRéception.total++;
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.avecAccuséRéception.erreurs.push(
              {
                identifiantProjet,
                dateQualification: ligne.dateAccuseReception,
                erreur: error as string,
              },
            );
            index++;
            continue;
          }
        }
      }

      if (raccordement.dossiers.length === 0) {
        statistics.pasDeDossierDeRaccordement.total++;

        if (!ligne.dateAccuseReception) {
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs.push(
            {
              identifiantProjet,
              référenceDossier: ligne.referenceDossier,
              erreur: "Pas de ligne date d'accusé de réception",
            },
          );
          index++;
          continue;
        }

        try {
          await mediator.send<Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
            type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
            data: {
              identifiantProjetValue: identifiantProjet,
              dateQualificationValue: formatDateQualification(ligne.dateAccuseReception),
              référenceDossierValue: ligne.referenceDossier,
              transmiseParValue: Email.system().formatter(),
            },
          });

          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.total++;
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès.push(
            {
              identifiantProjet,
              référenceDossier: ligne.referenceDossier,
            },
          );

          try {
            await mediator.send<Tâche.AjouterTâcheCommand>({
              type: 'System.Tâche.Command.AjouterTâche',
              data: {
                identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
                typeTâche:
                  Tâche.TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement,
              },
            });
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.total++;
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.succès.push(
              {
                identifiantProjet,
                référenceDossier: ligne.referenceDossier,
              },
            );
          } catch (error) {
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.total++;
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.erreurs.push(
              {
                identifiantProjet,
                référenceDossier: ligne.referenceDossier,
                erreur: `Erreur lors de la création de la tâche pour renseigner l'accusé de réception de la demande complète de raccordement pour le projet ${identifiantProjet} : ${error}`,
              },
            );
            index++;
            continue;
          }
        } catch (error) {
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.total++;
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs.push(
            {
              identifiantProjet,
              référenceDossier: ligne.referenceDossier,
              erreur: `Erreur lors de la création du dossier de raccordement pour le projet ${identifiantProjet} : ${error}`,
            },
          );
          index++;
          continue;
        }
      }

      index++;

      await sleep(300);
    }

    await writeStatisticsToFiles(statistics);
    await logStatistics(statistics);

    process.exit(0);
  }
}

const deleteFolderIfExists = async (folderPath: string) => {
  try {
    // Vérifie si le dossier existe
    await access(folderPath, constants.F_OK);

    // Supprime le dossier et son contenu
    await rm(folderPath, { recursive: true, force: true });
    console.log(`Dossier supprimé : ${folderPath}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du dossier : ${error}`);
  }
};

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const formatDateQualification = (dateString: string) =>
  DateTime.convertirEnValueType(
    new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')),
  ).formatter();

type Statistics = {
  total: number;
  ligneSansRéférenceDossier: Array<string>;
  projetSansRaccordement: Array<string>;
  plusieursDossiersDeRaccordement: Array<{
    identifiantProjet: string;
    référenceFichier: string;
    référencesActuelles: string[];
  }>;
  UnSeulDossierDeRaccordement: {
    total: number;
    modifierRéférenceDossierRaccordement: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        référenceDossier: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        référenceDossier: string;
        erreur: string;
      }>;
    };
    modifierDemandeComplètementRaccordement: {
      total: number;
      sansAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          dateQualification: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          dateQualification: string;
          erreur: string;
        }>;
      };
      avecAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          dateQualification: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          dateQualification: string;
          erreur: string;
        }>;
      };
    };
  };
  pasDeDossierDeRaccordement: {
    total: number;
    transmettreDemandeComplètementRaccordement: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        référenceDossier: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        référenceDossier: string;
        erreur: string;
      }>;
      tâcheRenseignerAccuséRéception: {
        total: number;
        succès: Array<{
          identifiantProjet: string;
          référenceDossier: string;
        }>;
        erreurs: Array<{
          identifiantProjet: string;
          référenceDossier: string;
          erreur: string;
        }>;
      };
    };
  };
};

const getStatistics = (total: number) => {
  const statistics: Statistics = {
    total,
    ligneSansRéférenceDossier: [],
    projetSansRaccordement: [],
    plusieursDossiersDeRaccordement: [],
    UnSeulDossierDeRaccordement: {
      total: 0,
      modifierRéférenceDossierRaccordement: {
        total: 0,
        succès: [],
        erreurs: [],
      },
      modifierDemandeComplètementRaccordement: {
        total: 0,
        sansAccuséRéception: {
          total: 0,
          succès: [],
          erreurs: [],
        },
        avecAccuséRéception: {
          total: 0,

          succès: [],
          erreurs: [],
        },
      },
    },
    pasDeDossierDeRaccordement: {
      total: 0,
      transmettreDemandeComplètementRaccordement: {
        total: 0,
        succès: [],
        erreurs: [],
        tâcheRenseignerAccuséRéception: {
          total: 0,
          succès: [],
          erreurs: [],
        },
      },
    },
  };

  return statistics;
};

const logStatistics = (stats: Statistics) => {
  console.log('===== Log Final des Statistiques =====');

  // Afficher les statistiques globales
  console.log(`Total: ${stats.total}`);
  console.log(`Ligne Sans Référence Dossier: ${stats.ligneSansRéférenceDossier.length}`);
  console.log(`Projet Sans Raccordement: ${stats.projetSansRaccordement.length}`);
  console.log(
    `Nombre de Projets avec Plusieurs Dossiers de Raccordement: ${stats.plusieursDossiersDeRaccordement.length}`,
  );

  // UnSeulDossierDeRaccordement
  const unSeulDossier = stats.UnSeulDossierDeRaccordement;
  console.log(`Un Seul Dossier de Raccordement - Total: ${unSeulDossier.total}`);
  console.log(
    `  Modifier Référence Dossier Raccordement - Total: ${unSeulDossier.modifierRéférenceDossierRaccordement.total}`,
  );
  console.log(`    Succès: ${unSeulDossier.modifierRéférenceDossierRaccordement.succès.length}`);
  console.log(`    Erreurs: ${unSeulDossier.modifierRéférenceDossierRaccordement.erreurs.length}`);

  console.log(
    `  Modifier Demande Complètement Raccordement - Total: ${unSeulDossier.modifierDemandeComplètementRaccordement.total}`,
  );
  console.log(
    `     Sans accusé de réception : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.total}`,
  );
  console.log(
    `         Succès : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.succès.length}`,
  );
  console.log(
    `         Erreurs : ${unSeulDossier.modifierDemandeComplètementRaccordement.sansAccuséRéception.erreurs.length}`,
  );
  console.log(
    `     Avec accusé de réception : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.total}`,
  );
  console.log(
    `         Succès : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.succès.length}`,
  );
  console.log(
    `         Erreurs : ${unSeulDossier.modifierDemandeComplètementRaccordement.avecAccuséRéception.erreurs.length}`,
  );

  // Pas de Dossier de Raccordement
  const pasDeDossier = stats.pasDeDossierDeRaccordement;
  console.log(`Pas de Dossier de Raccordement - Total: ${pasDeDossier.total}`);

  console.log(
    `  Transmettre Demande Complètement Raccordement - Total: ${pasDeDossier.transmettreDemandeComplètementRaccordement.total}`,
  );
  console.log(
    `    Succès: ${pasDeDossier.transmettreDemandeComplètementRaccordement.succès.length}`,
  );
  console.log(
    `    Erreurs: ${pasDeDossier.transmettreDemandeComplètementRaccordement.erreurs.length}`,
  );
  console.log(
    `  Tâche renseigner accusé réception DCR - Total: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.total}`,
  );
  console.log(
    `    Succès: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.succès.length}`,
  );
  console.log(
    `    Erreurs: ${pasDeDossier.transmettreDemandeComplètementRaccordement.tâcheRenseignerAccuséRéception.erreurs.length}`,
  );

  // Résumé final
  console.log('===== Fin des Statistiques =====');
};

const writeStatisticsToFiles = async (statistics: Statistics) => {
  if (statistics.ligneSansRéférenceDossier.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'ligneSansRéférenceDossier.json'),
      JSON.stringify(statistics.ligneSansRéférenceDossier, null, 2),
    );
  }
  if (statistics.projetSansRaccordement.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'projetSansRaccordement.json'),
      JSON.stringify(statistics.projetSansRaccordement, null, 2),
    );
  }
  if (statistics.plusieursDossiersDeRaccordement.length > 0) {
    await writeFile(
      path.resolve(__dirname, '../logs', 'plusieursDossiersDeRaccordement.json'),
      JSON.stringify(statistics.plusieursDossiersDeRaccordement, null, 2),
    );
  }
  if (statistics.UnSeulDossierDeRaccordement.total > 0) {
    await mkdir(path.resolve(__dirname, '../logs/unSeulDossierDeRaccordement'), {
      recursive: true,
    });

    /**
     * Un seul dossier de raccordement : modifier la référence du dossier de raccordement
     */
    if (
      statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.erreurs.length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/unSeulDossierDeRaccordement',
          'modifierRéférenceDossierRaccordement_erreurs.json',
        ),
        JSON.stringify(
          statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.erreurs,
          null,
          2,
        ),
      );
    }
    if (
      statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès.length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/unSeulDossierDeRaccordement',
          'modifierRéférenceDossierRaccordement_succès.json',
        ),
        JSON.stringify(
          statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès,
          null,
          2,
        ),
      );
    }
  }

  if (statistics.pasDeDossierDeRaccordement.total > 0) {
    await mkdir(path.resolve(__dirname, '../logs/pasDeDossierDeRaccordement'), { recursive: true });

    /**
     * Pas de dossier de raccordement : transmettre la demande complète de raccordement
     */
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs
        .length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/pasDeDossierDeRaccordement',
          'transmettreDemandeComplètementRaccordement_erreurs.json',
        ),
        JSON.stringify(
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs,
          null,
          2,
        ),
      );
    }
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès
        .length > 0
    ) {
      await writeFile(
        path.resolve(
          __dirname,
          '../logs/pasDeDossierDeRaccordement',
          'transmettreDemandeComplètementRaccordement_succès.json',
        ),
        JSON.stringify(
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès,
          null,
          2,
        ),
      );
    }

    /***
     *  Pas de dossier de raccordement -> transmettre la demande complète de raccordement -> tâche renseigner accusé réception DCR
     */
    if (
      statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
        .tâcheRenseignerAccuséRéception.total > 0
    ) {
      if (
        statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
          .tâcheRenseignerAccuséRéception.erreurs.length > 0
      ) {
        await writeFile(
          path.resolve(
            __dirname,
            '../logs/pasDeDossierDeRaccordement',
            'tâcheRenseignerAccuséRéception_erreurs.json',
          ),
          JSON.stringify(
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.erreurs,
            null,
            2,
          ),
        );
      }
      if (
        statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
          .tâcheRenseignerAccuséRéception.succès.length > 0
      ) {
        await writeFile(
          path.resolve(
            __dirname,
            '../logs/pasDeDossierDeRaccordement',
            'tâcheRenseignerAccuséRéception_succès.json',
          ),
          JSON.stringify(
            statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement
              .tâcheRenseignerAccuséRéception.succès,
            null,
            2,
          ),
        );
      }
    }
  }
};
