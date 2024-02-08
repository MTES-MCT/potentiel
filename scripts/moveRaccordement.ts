import { join } from 'node:path';
import { appendFile } from 'node:fs/promises';
import { extension } from 'mime-types';

import { executeSelect } from '@potentiel/pg-helpers';
import { Raccordement } from '@potentiel-domain/reseau';
import { DeleteObjectCommand, GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const bucketName = process.env.BUCKET_NAME;
const client = new S3({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const log = async (message: string) => {
  console.log(message);
  await appendFile('log.txt', '\n', {
    encoding: 'utf-8',
  });
  return appendFile('log.txt', message, {
    encoding: 'utf-8',
  });
};

(async () => {
  await log(`ℹ Start move files`);
  const dossiers = await executeSelect<{
    key: string;
    value: Raccordement.DossierRaccordementEntity;
  }>(`
    select key, value from domain_views.projection where key like 'dossier-raccordement|%'
  `);

  await log(`ℹ ${dossiers.length} dossiers trouvés`);

  const paths: Array<{
    ancienPath: string;
    nouveauPath: string;
  }> = [];

  // Référenciel fichier à déplacer
  await log('');
  await log(`Consitution du référenciel de fichier à déplacer`);
  await log('');

  for (const { key, value } of dossiers) {
    let arPath = {
      ancienPath: '',
      nouveauPath: '',
    };

    let ptfPath = {
      ancienPath: '',
      nouveauPath: '',
    };

    try {
      const [, identifiant] = key.split('|');
      const [appelOffre, période, famille, numéroCRE] = identifiant.split('#');
      const identifiantProjet = `${appelOffre}#${période}#${famille}#${numéroCRE}`;

      if (value.demandeComplèteRaccordement.accuséRéception) {
        //ancien path  : {identifiantProjet}/{référence}/demande-complete-raccordement.{extension}
        //nouveau path : {identifiantProjet}/raccordement/{référence}/accusé-réception/{date}.{extension}
        const format = extension(value.demandeComplèteRaccordement.accuséRéception.format);
        const date =
          value.demandeComplèteRaccordement.dateQualification || '2020-02-17T00:00:00.000Z';

        const ancienPath = join(
          identifiantProjet,
          value.référence,
          `demande-complete-raccordement.${format}`,
        );
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'accusé-réception',
          `${date}.${format}`,
        );

        arPath = {
          ancienPath,
          nouveauPath,
        };

        paths.push({
          ancienPath,
          nouveauPath,
        });
      }

      if (
        value.propositionTechniqueEtFinancière &&
        value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
      ) {
        //ancien path  : {identifiantProjet}/{référence}/proposition-technique-et-financière.{extension}
        //nouveau path : {identifiantProjet}/raccordement/{référence}/proposition-technique-et-financière/{date}.{extension}
        const format = extension(
          value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format,
        );

        const ancienPath = join(
          identifiantProjet,
          value.référence,
          `proposition-technique-et-financiere.${format}`,
        );

        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'proposition-technique-et-financière',
          `${value.propositionTechniqueEtFinancière.dateSignature}.${format}`,
        );

        ptfPath = {
          ancienPath,
          nouveauPath,
        };

        paths.push({
          ancienPath,
          nouveauPath,
        });
      }
    } catch (e) {
      await log(`----------------------------`);
      await log(`Erreur Constitution`);
      await log(`❌ ${e.message}`);
      await log(`AR: ${JSON.stringify(arPath)}`);
      await log(`PTF: ${JSON.stringify(ptfPath)}`);
      await log(`----------------------------`);
    }
  }

  await log('');
  await log('Déplacement fichier');
  await log('');

  let erreurDéplacement = 0;

  // Déplacement fichier
  for (const { ancienPath, nouveauPath } of paths) {
    try {
      const content = await client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: ancienPath,
        }),
      );

      await new Upload({
        client,
        params: {
          Bucket: bucketName,
          Key: nouveauPath,
          Body: content.Body,
        },
      }).done();

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: ancienPath,
        }),
      );
    } catch (e) {
      erreurDéplacement++;
      await log(`----------------------------`);
      await log(`Erreur déplacement`);
      await log(`❌ ${e.message}`);
      await log(`Ancien path: ${ancienPath}`);
      await log(`Nouveau path: ${nouveauPath}`);
      await log(`----------------------------`);
    }
  }

  await log(`Erreur déplacement: ${erreurDéplacement}`);

  //recheck fichier
  let erreurRecheck = 0;
  let recheck = 0;
  await log('');
  await log('Recheck fichiers du dossier');
  await log('');

  for (const { key, value } of dossiers) {
    await sleep(50);
    console.log(`Dossier ${key}`);
    const [, identifiant] = key.split('|');
    const [appelOffre, période, famille, numéroCRE] = identifiant.split('#');
    const identifiantProjet = `${appelOffre}#${période}#${famille}#${numéroCRE}`;

    let arPath = '';
    let ptfPath = '';
    try {
      if (value.demandeComplèteRaccordement.accuséRéception?.format) {
        const date =
          value.demandeComplèteRaccordement.dateQualification || '2020-02-17T00:00:00.000Z';
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'accusé-réception',
          `${date}.${extension(value.demandeComplèteRaccordement.accuséRéception?.format)}`,
        );
        arPath = nouveauPath;
        console.log(arPath);
        await client.send(
          new GetObjectCommand({
            Bucket: bucketName,
            Key: nouveauPath,
          }),
        );
      }

      if (
        value.propositionTechniqueEtFinancière &&
        value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
      ) {
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'proposition-technique-et-financière',
          `${value.propositionTechniqueEtFinancière.dateSignature}.${extension(
            value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée?.format,
          )}`,
        );
        ptfPath = nouveauPath;
        console.log(ptfPath);
        await client.send(
          new GetObjectCommand({
            Bucket: bucketName,
            Key: nouveauPath,
          }),
        );
      }
      recheck++;
      console.log(`✅ ${recheck}/${dossiers.length}`);

      console.log(arPath);
    } catch (e) {
      erreurRecheck++;
      await log(`----------------------------`);
      await log(`Erreur recheck`);
      await log(`❌ ${e.message}`);
      await log(`AR path ${arPath}`);
      await log(`PTF path: ${ptfPath}`);
      await log(`----------------------------`);
    }
  }

  await log(`Recheck: ${recheck}`);
  await log(`Erreur recheck: ${erreurRecheck}`);
})();
