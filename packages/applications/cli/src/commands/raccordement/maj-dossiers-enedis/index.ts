import path from 'path';

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { mediator } from 'mediateur';
import { Command, Flags } from '@oclif/core';
import zod from 'zod';

import { Option } from '@potentiel-libraries/monads';
import {
  countProjection,
  findProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { killPool } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Raccordement, registerLauréatQueries } from '@potentiel-domain/laureat';
import { DateTime, Email } from '@potentiel-domain/common';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

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
});

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
    transmettreDateMiseEnService: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        dateMiseEnService: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        dateMiseEnService: string;
        erreur: string;
      }>;
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
    };
    transmettreDateMiseEnService: {
      total: number;
      succès: Array<{
        identifiantProjet: string;
        dateMiseEnService: string;
      }>;
      erreurs: Array<{
        identifiantProjet: string;
        dateMiseEnService: string;
        erreur: string;
      }>;
    };
  };
};

export class MajDossiersEnedis extends Command {
  static description =
    "Lire le contenu d'un fichier CSV rempli par Enedis pour venir (en one shot) créer / mettre à jour les dossiers de raccordement ainsi que la date de mise en service. Cette opération est ponctuelle";

  async init() {
    registerLauréatQueries({
      count: countProjection,
      find: findProjection,
      list: listProjection,
      récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
    });
  }

  static flags = {
    dryRun: Flags.boolean(),
  };

  async finally() {
    await killPool();
  }

  async run() {
    envVariablesSchema.parse(process.env);

    const { flags } = await this.parse(MajDossiersEnedis);
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

    const { parsedData } = await parseCsvFile(
      path.resolve(__dirname, './dossiers_raccordements_modifies_fake.csv'),
      csvSchema,
      {
        delimiter: ',',
        encoding: 'utf8',
      },
    );

    if (parsedData.length === 0) {
      logger.error('❌ Aucune donnée à traiter ❌');
      process.exit(1);
    }

    const statistics: Statistics = {
      total: parsedData.length,
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
          succès: [],
          erreurs: [],
        },
        transmettreDateMiseEnService: {
          total: 0,
          succès: [],
          erreurs: [],
        },
      },
      pasDeDossierDeRaccordement: {
        total: 0,
        transmettreDemandeComplètementRaccordement: {
          total: 0,
          succès: [],
          erreurs: [],
        },
        transmettreDateMiseEnService: {
          total: 0,
          succès: [],
          erreurs: [],
        },
      },
    };

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
            if (!flags.dryRun) {
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
            }
            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.total++;
            statistics.UnSeulDossierDeRaccordement.modifierRéférenceDossierRaccordement.succès.push(
              {
                identifiantProjet,
                référenceDossier: ligne.referenceDossier,
              },
            );
          } catch (error) {
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
          try {
            if (!flags.dryRun) {
              /**
               * Par défaut, on génère un accusé de réception
               */
              let accuséRéceptionValue = await generateDocument(
                `Accusé de réception de la demande complète de raccordement pour le dossier ${ligne.referenceDossier} du projet ${identifiantProjet}`,
              );

              /**
               * Si l'accusé de réception est déjà présent, on le récupère
               */
              if (dossierRaccordement.demandeComplèteRaccordement.accuséRéception) {
                const document = await mediator.send<ConsulterDocumentProjetQuery>({
                  type: 'Document.Query.ConsulterDocumentProjet',
                  data: {
                    documentKey:
                      dossierRaccordement.demandeComplèteRaccordement.accuséRéception.formatter(),
                  },
                });

                if (Option.isSome(document)) {
                  accuséRéceptionValue = document;
                }
              }

              await mediator.send<Raccordement.ModifierDemandeComplèteRaccordementUseCase>({
                type: 'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
                data: {
                  identifiantProjetValue: identifiantProjet,
                  référenceDossierRaccordementValue: ligne.referenceDossier,
                  dateQualificationValue: formatDateQualification(ligne.dateAccuseReception),
                  accuséRéceptionValue,
                  rôleValue: 'admin',
                },
              });
            }

            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.total++;
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.succès.push(
              {
                identifiantProjet,
                dateQualification: ligne.dateAccuseReception,
              },
            );
          } catch (error) {
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.total++;
            statistics.UnSeulDossierDeRaccordement.modifierDemandeComplètementRaccordement.erreurs.push(
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

        /***
         * Si il y a une date de mise en service et qu'elle est différente de l'existant
         */
        if (
          ligne.dateMiseEnService &&
          dossierRaccordement.miseEnService?.dateMiseEnService &&
          !dossierRaccordement.miseEnService.dateMiseEnService.estÉgaleÀ(
            DateTime.convertirEnValueType(formatDateQualification(ligne.dateMiseEnService)),
          )
        ) {
          try {
            if (!flags.dryRun) {
              await mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
                type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
                data: {
                  identifiantProjetValue: identifiantProjet,
                  référenceDossierValue: ligne.referenceDossier,
                  dateMiseEnServiceValue: formatDateQualification(ligne.dateMiseEnService),
                  transmiseLeValue: DateTime.now().formatter(),
                  transmiseParValue: Email.system().formatter(),
                },
              });
            }
            statistics.UnSeulDossierDeRaccordement.transmettreDateMiseEnService.total++;
            statistics.UnSeulDossierDeRaccordement.transmettreDateMiseEnService.succès.push({
              identifiantProjet,
              dateMiseEnService: ligne.dateMiseEnService,
            });
          } catch (error) {
            statistics.UnSeulDossierDeRaccordement.transmettreDateMiseEnService.total++;
            statistics.UnSeulDossierDeRaccordement.transmettreDateMiseEnService.erreurs.push({
              identifiantProjet,
              dateMiseEnService: ligne.dateMiseEnService,
              erreur: error as string,
            });
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
          if (!flags.dryRun) {
            const accuséRéceptionValue = await generateDocument(
              `Accusé de réception de la demande complète de raccordement non transmis pour le dossier ${ligne.referenceDossier} du projet ${identifiantProjet}`,
            );

            await mediator.send<Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
              type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
              data: {
                identifiantProjetValue: identifiantProjet,
                dateQualificationValue: ligne.dateAccuseReception,
                accuséRéceptionValue,
                référenceDossierValue: ligne.referenceDossier,
              },
            });
          }

          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.total++;
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.succès.push(
            {
              identifiantProjet,
              référenceDossier: ligne.referenceDossier,
            },
          );
        } catch (error) {
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.total++;
          statistics.pasDeDossierDeRaccordement.transmettreDemandeComplètementRaccordement.erreurs.push(
            {
              identifiantProjet,
              référenceDossier: ligne.referenceDossier,
              erreur: error as string,
            },
          );
          index++;
          continue;
        }

        if (ligne.dateMiseEnService) {
          try {
            if (!flags.dryRun) {
              const dateMiseEnServiceValue = formatDateQualification(ligne.dateMiseEnService);

              await mediator.send<Raccordement.TransmettreDateMiseEnServiceUseCase>({
                type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
                data: {
                  identifiantProjetValue: identifiantProjet,
                  référenceDossierValue: ligne.referenceDossier,
                  dateMiseEnServiceValue,
                  transmiseLeValue: DateTime.now().formatter(),
                  transmiseParValue: Email.system().formatter(),
                },
              });
              statistics.pasDeDossierDeRaccordement.transmettreDateMiseEnService.total++;
              statistics.pasDeDossierDeRaccordement.transmettreDateMiseEnService.succès.push({
                identifiantProjet,
                dateMiseEnService: ligne.dateMiseEnService,
              });
            }
          } catch (error) {
            statistics.pasDeDossierDeRaccordement.transmettreDateMiseEnService.total++;
            statistics.pasDeDossierDeRaccordement.transmettreDateMiseEnService.erreurs.push({
              identifiantProjet,
              dateMiseEnService: ligne.dateMiseEnService,
              erreur: error as string,
            });
            index++;
            continue;
          }
        }
      }
    }

    /*
 const statistics: Statistics = {
   total: parsedData.length,
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
       succès: [],
       erreurs: [],
     },
     transmettreDateMiseEnService: {
       total: 0,
       succès: [],
       erreurs: [],
     },
   },
   pasDeDossierDeRaccordement: {
     total: 0,
     transmettreDemandeComplètementRaccordement: {
       total: 0,
       succès: [],
       erreurs: [],
     },
     transmettreDateMiseEnService: {
       total: 0,
       succès: [],
       erreurs: [],
     },
   },
 };

*/

    logger.info('📊 Statistiques de la mise à jour des dossiers de raccordement :');
    logger.info(`Total : ${statistics.total} / ${parsedData.length}`);
    logger.info(`Ligne sans référence de dossier : ${statistics.ligneSansRéférenceDossier.length}`);
    logger.info(`Projet sans raccordement : ${statistics.projetSansRaccordement.length}`);
    logger.info(
      `Plusieurs dossiers de raccordement : ${statistics.plusieursDossiersDeRaccordement.length}`,
    );
    logger.info(
      `Un seul dossier de raccordement : ${statistics.UnSeulDossierDeRaccordement.total}`,
    );
    logger.info(`Pas de dossier de raccordement : ${statistics.pasDeDossierDeRaccordement.total}`);

    process.exit(0);
  }
}

const generateDocument = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 24;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  const x = page.getWidth() / 2 - textWidth / 2;

  page.drawText(text, {
    x: x > 0 ? x : 0,
    y: page.getHeight() / 2 - textHeight / 2,
    size: textSize,
    font: helveticaFont,
    maxWidth: page.getWidth(),
  });

  const pdfBytes = await pdfDoc.save();

  return {
    format: 'application/pdf',
    content: new Blob([pdfBytes], { type: 'application/pdf' }).stream(),
  };
};

const formatDateQualification = (dateString: string) => {
  return new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')).toISOString();
};
