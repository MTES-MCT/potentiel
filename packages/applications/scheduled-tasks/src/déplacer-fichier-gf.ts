/*
Requête pour récupérer les fichiers  :
-------------------------------------------------------------------------------------------------------------------------------------------------
SELECT
    p."appelOffreId" as appel_offre,
    p."periodeId" as periode,
    p."familleId" as famille,
    p."numeroCRE" as numero_cre,
    CASE
        WHEN gf.statut = 'validé' THEN 'actuelle' -- date -> validé le
        ELSE 'depot' -- date -> soumis le
    END as type,
    REPLACE(f."storedAt", 'S3:potentiel-production:', '') as file_path
FROM "garantiesFinancières" as gf
INNER JOIN "files" as f on gf."fichierId" = f.id
INNER JOIN "projects" as p on gf."projetId" = p.id
WHERE "statut" <> 'en attente';
-------------------------------------------------------------------------------------------------------------------------------------------------
*/

import * as readline from 'node:readline';
import { extname } from 'node:path';
import { contentType } from 'mime-types';

import { mediator } from 'mediateur';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import {
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
  ConsulterDocumentProjetQuery,
  registerDocumentProjetQueries,
  registerDocumentProjetCommand,
} from '@potentiel-domain/document';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DocumentAdapter } from '@potentiel-infrastructure/domain-adapters';

registerDocumentProjetQueries({
  récupérerDocumentProjet: DocumentAdapter.téléchargerDocumentProjet,
});

registerDocumentProjetCommand({
  enregistrerDocumentProjet: DocumentAdapter.téléverserDocumentProjet,
  déplacerDossierProjet: DocumentAdapter.déplacerDossierProjet,
});

const printProgress = (progress: string) => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress);
};

const legacyBucketEndPoint = process.env.LEGACY_S3_ENDPOINT || '';
const legacyBucketAccessKeyId = process.env.LEGACY_S3_ACCESS_KEY_ID || '';
const legacyBucketSecretAccessKey = process.env.LEGACY_S3_SECRET_ACCESS_KEY || '';
const legacyBucketName = process.env.LEGACY_S3_BUCKET || '';

const legacyBucket = new S3({
  endpoint: legacyBucketEndPoint,
  credentials: {
    accessKeyId: legacyBucketAccessKeyId,
    secretAccessKey: legacyBucketSecretAccessKey,
  },
  forcePathStyle: true,
});

async function moveFiles() {
  const startTime = new Date();

  const files = await executeSelect<{
    identifiant_projet: string;
    file_path: string;
    date_validation: string | undefined;
    date_envoi: string;
  }>(`
    SELECT p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as identifiant_projet,
        REPLACE(f."storedAt", 'S3:potentiel-production:', '') as file_path,
        gf."validéesLe" as date_validation,
        gf."dateEnvoi" as date_envoi
    FROM "garantiesFinancières" as gf
    INNER JOIN "files" as f on gf."fichierId" = f.id
    INNER JOIN "projects" as p on gf."projetId" = p.id
    WHERE "statut" <> 'en attente';
  `);

  const total = files.length;
  let totalExisting = 0;
  let totalErrors = 0;

  console.info(`🚚 Start moving files 10 by 10`);

  while (files.length) {
    await Promise.all(
      files
        .splice(0, 10)
        .map(async ({ file_path, identifiant_projet, date_validation, date_envoi }) => {
          const start = new Date().getTime();

          const gfSoumisesDocument = DocumentProjet.convertirEnValueType(
            identifiant_projet,
            GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
            new Date(date_envoi).toISOString(),
            contentType(extname(file_path)).toString(),
          );

          const gfSoumisesExists = await getFileContent(gfSoumisesDocument);

          if (gfSoumisesExists) {
            totalExisting = totalExisting + 1;
            return;
          }

          try {
            const { Body } = await legacyBucket.send(
              new GetObjectCommand({
                Bucket: legacyBucketName,
                Key: file_path,
              }),
            );

            if (!Body) {
              throw new Error('Empty document');
            }

            const contentGfSoumises = Body.transformToWebStream();

            await mediator.send<EnregistrerDocumentProjetCommand>({
              type: 'Document.Command.EnregistrerDocumentProjet',
              data: {
                content: contentGfSoumises,
                documentProjet: gfSoumisesDocument,
              },
            });

            console.info(
              `GF soumises: [${file_path}] migration to [${gfSoumisesDocument.formatter()}] took ${
                new Date().getTime() - start
              }ms`,
            );

            if (date_validation) {
              const { Body } = await legacyBucket.send(
                new GetObjectCommand({
                  Bucket: legacyBucketName,
                  Key: file_path,
                }),
              );

              if (!Body) {
                throw new Error('Empty document');
              }

              const contentGfActuelles = Body.transformToWebStream();

              const gfActuelleDocument = DocumentProjet.convertirEnValueType(
                identifiant_projet,
                GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
                new Date(date_validation).toISOString(),
                contentType(extname(file_path)).toString(),
              );

              await mediator.send<EnregistrerDocumentProjetCommand>({
                type: 'Document.Command.EnregistrerDocumentProjet',
                data: {
                  content: contentGfActuelles,
                  documentProjet: gfActuelleDocument,
                },
              });

              console.info(
                `GF actuelle: [${file_path}] migration to [${gfSoumisesDocument.formatter()}] took ${
                  new Date().getTime() - start
                }ms`,
              );
            }
          } catch (error) {
            totalErrors = totalErrors + 1;

            console.error(
              `\nAn error occured while moving file ${file_path}\n ${(error as Error).message}`,
            );
          }
        }),
    );

    printProgress(`${total - files.length}/${total}`);
  }

  const timeElapsed = new Date().getTime() - startTime.getTime();

  if (totalErrors > 0) {
    console.info(`\n☠️ Migration has errors. Total errors = ${totalErrors} / ${total}`);
  }

  console.info(
    `\n✅ Migration completed successfully ${timeElapsed}ms. Total already uploaded = ${totalExisting}`,
  );
}

moveFiles();

const getFileContent = async (documentProjet: DocumentProjet.ValueType) => {
  try {
    await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: documentProjet.formatter(),
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};
