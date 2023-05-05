/*
Requête pour récupérer les fichiers dcr et ptf à déplacer :
-------------------------------------------------------------------------------------------------------------------------------------------------
SELECT
    REPLACE(f."storedAt", 'S3:potentiel-production:', '') AS "sourceFilePath",
    CONCAT(p."appelOffreId", '#', p."periodeId", '#', p."familleId", '#', p."numeroCRE", '/', r."identifiantGestionnaire", CASE WHEN f.designation = 'dcr' THEN '/demande-complete-raccordement.' ELSE '/proposition-technique-et-financiere.' END, SUBSTRING(f."storedAt" from '\.([^\.]*)$')) AS "targetFilePath"
FROM files f 
INNER JOIN projects p ON f."forProject" = p.id
INNER JOIN raccordements r ON p.id = r."projetId" AND r."identifiantGestionnaire" is not null
WHERE f.designation IN ('dcr', 'ptf');

SELECT
    p."id",
    p."appelOffreId",
    p."periodeId",
    p."familleId",
    p."numeroCRE",
    
    CASE 
        WHEN r."identifiantGestionnaire" IS NOT NULL AND SUBSTRING(r."identifiantGestionnaire" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') != ''
        THEN SUBSTRING(r."identifiantGestionnaire" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})')

        WHEN SUBSTRING(f."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') != '' 
        THEN SUBSTRING(f."storedAt" from '(\D{3}[-\s]RP[-\s]20\d{2}[-\s]\d{6})') 
        
        WHEN r."identifiantGestionnaire" IS NOT NULL
        THEN r."identifiantGestionnaire"

        ELSE 'Référence non transmise' 
    END as "referenceDossier",
    
    REPLACE(f."storedAt", 'S3:potentiel-production:', '') AS "sourceFilePath",
    CONCAT(CASE WHEN f.designation = 'dcr' THEN 'demande-complete-raccordement.' ELSE 'proposition-technique-et-financiere.' END, SUBSTRING(f."storedAt" from '\.([^\.]*)$')) AS "targetFileName"
FROM files f 
INNER JOIN projects p ON f."forProject" = p.id
INNER JOIN raccordements r ON p.id = r."projetId"
WHERE f.designation IN ('dcr', 'ptf');
-------------------------------------------------------------------------------------------------------------------------------------------------
*/

import * as readline from 'readline';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { extname, join } from 'path';
import { formatIdentifiantProjet } from '@potentiel/domain';

const printProgress = (progress) => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress);
};

const sourceEndPoint = '';
const sourceAccessKeyId = '';
const sourceSecretAccessKey = '';
const sourceBucketName = 'potentiel-production';
const source = new S3({
  endpoint: sourceEndPoint,
  accessKeyId: sourceAccessKeyId,
  secretAccessKey: sourceSecretAccessKey,
  s3ForcePathStyle: true,
});

const targetEndPoint = '';
const targetAccessKeyId = '';
const targetSecretAccessKey = '';
const targetBucketName = '?';
const target = new S3({
  endpoint: targetEndPoint,
  accessKeyId: targetAccessKeyId,
  secretAccessKey: targetSecretAccessKey,
  s3ForcePathStyle: true,
});

async function moveFiles() {
  const startTime = new Date();
  const jsonString = fs.readFileSync('./files.json', 'utf-8');
  const files = JSON.parse(jsonString) as Array<{
    id: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
    referenceDossier: string;
    sourceFilePath: string;
    fileType: 'dcr' | 'ptf';
  }>;

  const total = files.length;
  console.info(`🚚 Start moving files 10 by 10`);

  while (files.length) {
    await Promise.all(
      files.splice(0, 10).map(async (file) => {
        const identifiantProjet = {
          appelOffre: file.appelOffreId,
          période: file.periodeId,
          famille: file.familleId,
          numéroCRE: file.numeroCRE,
        };

        const fileName = `${
          file.fileType === 'dcr'
            ? 'demande-complete-raccordement'
            : 'proposition-technique-et-financiere'
        }${extname(file.sourceFilePath)}`;

        const targetFilePath = join(
          formatIdentifiantProjet(identifiantProjet),
          file.referenceDossier,
          fileName,
        );

        try {
          const result = await source
            .getObject({ Bucket: sourceBucketName, Key: file.sourceFilePath })
            .promise();
          const fileContent = Readable.from(result.Body as Buffer);

          await target
            .upload({
              Bucket: targetBucketName,
              Key: targetFilePath,
              Body: fileContent,
            })
            .promise();
        } catch (error) {
          console.error(
            `\n An error occured while moving file from ${file.sourceFilePath} to ${targetFilePath}`,
          );
        }
      }),
    );

    printProgress(`${total - files.length}/${total}`);
  }

  const timeElapsed = new Date().getTime() - startTime.getTime();
  console.info(`\n✅ Migration completed successfully ${timeElapsed}ms.`);
}

moveFiles();
