import * as readline from 'node:readline';
import fs from 'fs';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { mediator } from 'mediateur';
import { extname } from 'node:path';
import { contentType } from 'mime-types';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection, listProjectionV2 } from '@potentiel-infrastructure/pg-projections';
import {
  DocumentAdapter,
  récupérerRégionDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { getModèleMiseEnDemeureGarantiesFinancières } from '@potentiel-infrastructure/document-builder';
import { exists } from '@potentiel-libraries/file-storage';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import {
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
  registerDocumentProjetCommand,
} from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/common';

GarantiesFinancières.registerGarantiesFinancièresQueries({
  find: findProjection,
  listV2: listProjectionV2,
  récupérerRégionDreal: récupérerRégionDrealAdapter,
  buildModèleMiseEnDemeureGarantiesFinancières: getModèleMiseEnDemeureGarantiesFinancières,
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

(async () => {
  const start = new Date();
  const success: Array<string> = [];
  const errors: Array<string> = [];

  const garantiesFinancières =
    await listProjectionV2<GarantiesFinancières.GarantiesFinancièresEntity>(
      'garanties-financieres',
    );

  let actual = 0;

  for (const { identifiantProjet } of garantiesFinancières.items) {
    const { appelOffre, période, famille, numéroCRE } =
      IdentifiantProjet.convertirEnValueType(identifiantProjet);

    try {
      const garantieFinancière =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        });

      if (
        garantieFinancière.actuelles?.attestation &&
        garantieFinancière.actuelles.dateConstitution
      ) {
        const documentKey = garantieFinancière.actuelles.attestation.formatter();

        try {
          const isExistant = await exists(documentKey);
          if (!isExistant) {
            const files = await executeSelect<{ file_path: string }>(
              `
                SELECT REPLACE(f."storedAt", 'S3:potentiel-production:', '') as file_path
                FROM "garantiesFinancières" as gf
                INNER JOIN "files" as f on gf."fichierId" = f.id
                INNER JOIN "projects" as p on gf."projetId" = p.id
                WHERE p."appelOffreId" = $1
                AND   p."periodeId" = $2
                AND   p."familleId" = $3
                AND   p."numeroCRE" = $4;`,
              appelOffre,
              période,
              famille,
              numéroCRE,
            );

            if (!files.length) {
              const errorLine = `Error : No file retreived for actual GF !! - Projet : ${identifiantProjet} - Document key : ${documentKey}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            if (files.length > 1) {
              const errorLine = `Error : More than one file retreived !! - Projet : ${identifiantProjet}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            const file_path = files[0].file_path;
            const { Body } = await legacyBucket.send(
              new GetObjectCommand({
                Bucket: legacyBucketName,
                Key: file_path,
              }),
            );

            if (!Body) {
              const errorLine = `Error : No content retreived for file ${file_path} !! - Projet : ${identifiantProjet}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            const content = Body.transformToWebStream();

            const documentProjet = DocumentProjet.convertirEnValueType(
              garantieFinancière.identifiantProjet.formatter(),
              GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
              garantieFinancière.actuelles.dateConstitution.formatter(),
              contentType(extname(file_path)).toString(),
            );

            await mediator.send<EnregistrerDocumentProjetCommand>({
              type: 'Document.Command.EnregistrerDocumentProjet',
              data: {
                content,
                documentProjet,
              },
            });

            success.push(
              `✅ Successfully fix the current attestation file for the project ${identifiantProjet} - from ${file_path} to ${documentProjet.formatter()}`,
            );
          }
        } catch (error) {
          const errorLine = `Error : ${
            (error as Error).message
          } - Projet : ${identifiantProjet} - Attestation actuelle inexistante : ${documentKey}`;
          errors.push(errorLine);
        }
      }

      for (const dépôt of garantieFinancière.dépôts) {
        const documentKey = dépôt.attestation.formatter();

        try {
          const isExistant = await exists(documentKey);
          if (!isExistant) {
            const files = await executeSelect<{ file_path: string }>(
              `
                SELECT REPLACE(f."storedAt", 'S3:potentiel-production:', '') as file_path
                FROM "garantiesFinancières" as gf
                INNER JOIN "files" as f on gf."fichierId" = f.id
                INNER JOIN "projects" as p on gf."projetId" = p.id
                WHERE p."appelOffreId" = $1
                AND   p."periodeId" = $2
                AND   p."familleId" = $3
                AND   p."numeroCRE" = $4;`,
              appelOffre,
              période,
              famille,
              numéroCRE,
            );

            if (!files.length) {
              const errorLine = `Error : No file retreived for deposit GF !! - Projet : ${identifiantProjet} - Document key : ${documentKey}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            if (files.length > 1) {
              const errorLine = `Error : More than one file retreived !! - Projet : ${identifiantProjet}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            const file_path = files[0].file_path;
            const { Body } = await legacyBucket.send(
              new GetObjectCommand({
                Bucket: legacyBucketName,
                Key: file_path,
              }),
            );

            if (!Body) {
              const errorLine = `Error : No content retreived for file ${file_path} !! - Projet : ${identifiantProjet}`;
              errors.push(errorLine);
              actual++;
              continue;
            }

            const content = Body.transformToWebStream();

            const documentProjet = DocumentProjet.convertirEnValueType(
              garantieFinancière.identifiantProjet.formatter(),
              GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
              dépôt.dateConstitution.formatter(),
              contentType(extname(file_path)).toString(),
            );

            await mediator.send<EnregistrerDocumentProjetCommand>({
              type: 'Document.Command.EnregistrerDocumentProjet',
              data: {
                content,
                documentProjet,
              },
            });

            success.push(
              `✅ Successfully fix the attestation file of the deposit for the project ${identifiantProjet} - from ${file_path} to ${documentProjet.formatter()}`,
            );
          }
        } catch (error) {
          const errorLine = `Error : ${
            (error as Error).message
          } - Projet : ${identifiantProjet} - Attestion du dépôt du ${
            dépôt.soumisLe
          } inexistante : ${documentKey}`;
          errors.push(errorLine);
        }
      }
    } catch (error) {
      const errorLine = `Error : ${(error as Error).message} - Projet : ${identifiantProjet}`;
      errors.push(errorLine);
    }

    actual++;
    printProgress(`${actual} / ${garantiesFinancières.total}`);
  }

  const errorsFile = fs.createWriteStream(`errors-${start.toISOString()}.log`);
  errorsFile.write(errors.join('\n'));
  errorsFile.end();

  const successFile = fs.createWriteStream(`success-${start.toISOString()}.log`);
  successFile.write(success.join('\n'));
  successFile.end();
})();
