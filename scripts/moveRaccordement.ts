import { join } from 'node:path';
import { appendFile } from 'node:fs/promises';
import { extension } from 'mime-types';

import { executeSelect } from '@potentiel/pg-helpers';
import { Raccordement } from '@potentiel-domain/reseau';
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand, S3 } from '@aws-sdk/client-s3';

const bucketName = '';
const client = new S3({
  endpoint: '',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const log = async (message: string) => {
  console.log(message);
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

  let hasError = false;

  // Référenciel fichier à déplacer
  await log('');
  await log(`Consitution du référenciel de fichier à déplacer`);
  await log('');

  for (const { key, value } of dossiers) {
    await log(`------------------------------------------------`);
    try {
      const [, identifiant] = key.split('|');
      const [appelOffre, période, famille, numéroCRE] = identifiant.split('#');
      const identifiantProjet = `${appelOffre}#${période}#${famille}#${numéroCRE}`;

      await log(`ℹ Dossier [Id=${identifiantProjet}] - [Réf=${value.référence}]`);

      if (
        value.demandeComplèteRaccordement.accuséRéception &&
        value.demandeComplèteRaccordement.dateQualification
      ) {
        await log(`ℹ accusé de réception disponible`);
        //ancien path  : {identifiantProjet}/{référence}/accusé-réception.{extension}
        //nouveau path : {identifiantProjet}/raccordement/{référence}/accusé-réception/{date}.{extension}
        const format = extension(value.demandeComplèteRaccordement.accuséRéception.format);

        const ancienPath = join(identifiantProjet, value.référence, `accusé-réception.${format}`);
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'accusé-réception',
          `${value.demandeComplèteRaccordement.dateQualification}.${format}`,
        );

        paths.push({
          ancienPath,
          nouveauPath,
        });

        console.log(`ℹ Ancien path ${ancienPath}`);
        console.log(`ℹ Ancien path ${nouveauPath}`);
      }

      if (
        value.propositionTechniqueEtFinancière &&
        value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée
      ) {
        //ancien path  : {identifiantProjet}/{référence}/accusé-réception.{extension}
        //nouveau path : {identifiantProjet}/raccordement/{référence}/accusé-réception/{date}.{extension}
        const format = extension(
          value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format,
        );

        paths.push({
          ancienPath: join(
            identifiantProjet,
            value.référence,
            `proposition-technique-et-financière.${format}`,
          ),
          nouveauPath: join(
            identifiantProjet,
            'raccordement',
            value.référence,
            'proposition-technique-et-financière',
            `${value.propositionTechniqueEtFinancière.dateSignature}.${format}`,
          ),
        });
      }
    } catch (e) {
      hasError = true;
      await log(`❌ ${e.message}`);
    }
  }

  await log('');
  await log('Déplacement fichier');
  await log('');

  // Déplacement fichier
  for (const { ancienPath, nouveauPath } of paths) {
    await log(`------------------------------------------------`);
    try {
      await client.send(
        new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: ancienPath,
          Key: nouveauPath,
        }),
      );

      await log(`ℹ Ancien path ${ancienPath} copié vers ${nouveauPath}`);

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: ancienPath,
        }),
      );

      await log(`ℹ Ancien path ${ancienPath} supprimé`);
    } catch (e) {
      hasError = true;
      await log(`❌ ${e.message}`);
    }
  }

  //recheck fichier
  await log('');
  await log('Recheck fichiers du dossier');
  await log('');

  for (const { key, value } of dossiers) {
    const [, identifiant] = key.split('|');
    const [appelOffre, période, famille, numéroCRE] = identifiant.split('#');
    const identifiantProjet = `${appelOffre}#${période}#${famille}#${numéroCRE}`;

    try {
      await log(`ℹ Dossier [Key=${key}]`);
      if (
        value.demandeComplèteRaccordement.dateQualification &&
        value.demandeComplèteRaccordement.accuséRéception?.format
      ) {
        await log(`ℹ Check accusé réception`);
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'accusé-réception',
          `${value.demandeComplèteRaccordement.dateQualification}.${value.demandeComplèteRaccordement.accuséRéception?.format}`,
        );
        await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: nouveauPath }));
        await log(`✅ Checked`);
      }

      if (value.propositionTechniqueEtFinancière) {
        await log(`ℹ Check PTF`);
        const nouveauPath = join(
          identifiantProjet,
          'raccordement',
          value.référence,
          'proposition-technique-et-financière',
          `${value.propositionTechniqueEtFinancière.dateSignature}.${value.propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée?.format}`,
        );
        await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: nouveauPath }));
        await log(`✅ Checked`);
      }
    } catch (e) {
      hasError = true;
      await log(`❌ ${e.message}`);
    }
  }
})();
