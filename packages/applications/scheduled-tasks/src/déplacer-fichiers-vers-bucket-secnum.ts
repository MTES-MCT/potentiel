import { createWriteStream } from 'node:fs';

import { S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { StreamingBlobPayloadOutputTypes } from '@smithy/types';

import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

const sourceBucketName = process.env.S3_BUCKET;
const destinationBucketName = process.env.S3_SECNUM_BUCKET;

const récupérerToutesLesClésDesFichiers = async (source: S3, nextMarker?: string) => {
  getLogger().info('ℹ Getting all files from production');
  getLogger().info(`ℹ Next marker : ${nextMarker ? 'Yes' : 'No'}`);
  const {
    Contents: fileKeys,
    IsTruncated,
    NextMarker,
  } = await source.send(
    new ListObjectsCommand({
      Bucket: sourceBucketName,
      Marker: nextMarker,
    }),
  );

  let keys = fileKeys ? fileKeys.map((f) => f.Key).filter((f): f is string => f !== undefined) : [];

  if (IsTruncated) {
    getLogger().info(`ℹ List objects is truntaced : ${IsTruncated}`);
    const nextKeys = await récupérerToutesLesClésDesFichiers(source, NextMarker);
    keys = [...keys, ...nextKeys];
  }

  return keys;
};

type RécupérerContenuFichierProps = {
  s3: S3;
  bucketName: string;
  key: string;
};
const récupérerContenuFichier = async ({ s3, bucketName, key }: RécupérerContenuFichierProps) => {
  return s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
};

type TéléverserContenuFichierVersBucketCibleProps = {
  s3: S3;
  file: {
    Body: StreamingBlobPayloadOutputTypes;
    Key: string;
  };
};
const téléverserContenuFichierVersBucketCible = async ({
  s3,
  file: { Body, Key },
}: TéléverserContenuFichierVersBucketCibleProps) =>
  new Upload({
    client: s3,
    params: {
      Bucket: destinationBucketName,
      Key,
      Body,
    },
  }).done();

type ÉcrireFichierLogProps = {
  name: string;
  contenu: string[];
};
const écrireFichierLog = ({ name, contenu }: ÉcrireFichierLogProps) => {
  const file = createWriteStream(name);
  file.write(contenu.join('\n'));
  file.end();
};

const vérifierLesVariablesDEnvironnement = () => {
  const variables = [
    // SOURCE
    'S3_BUCKET',
    'S3_ENDPOINT',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',

    // DESTINATION
    'S3_SECNUM_BUCKET',
    'S3_SECNUM_ENDPOINT',
    'S3_SECNUM_AWS_ACCESS_KEY_ID',
    'S3_SECNUM_AWS_SECRET_ACCESS_KEY',
  ];

  for (const variable of variables) {
    if (!process.env[variable]) {
      getLogger().error(new Error(`❌ ${variable} is not defined`));
      process.exit(1);
    }
  }
};

void (async () => {
  vérifierLesVariablesDEnvironnement();

  getLogger().info('🏁 Moving production files to secnum S3 bucket');

  const source = new S3({
    endpoint: process.env.S3_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  const destination = new S3({
    endpoint: process.env.S3_SECNUM_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.S3_SECNUM_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECNUM_AWS_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  const keys = await récupérerToutesLesClésDesFichiers(source);

  if (keys.length === 0) {
    getLogger().warn('⚠️ No file keys found in the source bucket');
    process.exit(1);
  }

  getLogger().info(`✨ ${keys.length} fichiers à copier`);

  const fichiersDuBucketSourceSansContenu: string[] = [];
  const fichiersDuBucketDestinationSansContenu: string[] = [];
  const fichiersAvecContenuDifférent: string[] = [];
  const erreursDeTraitement: string[] = [];
  const fichiersSuccès: string[] = [];

  let count = 1;

  for (const key of keys) {
    try {
      getLogger().info(`👉 ${count} / ${keys.length} - Déplacement du fichier ${key}`);

      const { Body } = await récupérerContenuFichier({
        s3: source,
        bucketName: sourceBucketName as string,
        key,
      });

      if (!Body) {
        fichiersDuBucketSourceSansContenu.push(
          `❌ Erreur sur le fichier ${key} du bucket source : le fichier est vide ou n'existe pas`,
        );
        count += 1;
        continue;
      }

      await téléverserContenuFichierVersBucketCible({
        s3: destination,
        file: {
          Body,
          Key: key,
        },
      });

      const { Body: sourceFileBody } = await récupérerContenuFichier({
        s3: source,
        bucketName: sourceBucketName as string,
        key,
      });

      if (!sourceFileBody) {
        fichiersDuBucketSourceSansContenu.push(
          `❌ Erreur sur le fichier ${key} du bucket source : le fichier est vide ou n'existe pas`,
        );
        count += 1;
        continue;
      }

      const { Body: destinationFileBody } = await récupérerContenuFichier({
        s3: destination,
        bucketName: destinationBucketName as string,
        key,
      });

      if (!destinationFileBody) {
        fichiersDuBucketDestinationSansContenu.push(
          `❌ Erreur sur le fichier ${key} du bucket destination : le fichier n'a pas été copié`,
        );
        count += 1;
        continue;
      }

      const fichierSourceBodyString = await sourceFileBody.transformToString();
      const fichierDestinationBodyString = await destinationFileBody.transformToString();

      if (fichierSourceBodyString.length !== fichierDestinationBodyString.length) {
        fichiersAvecContenuDifférent.push(
          `❌ Erreur sur le fichier ${key} : la taille du fichier source (${fichierSourceBodyString.length}) est différente de celle du fichier destination (${fichierDestinationBodyString.length})`,
        );
        count += 1;
        continue;
      }

      fichiersSuccès.push(`✅ Fichier ${key} déplacé avec succès`);
      count += 1;
    } catch (e) {
      getLogger().error(e as Error);
      erreursDeTraitement.push(`❌ Erreur sur le fichier ${key} : ${(e as Error).message}`);
      count += 1;
    }
  }

  const now = DateTime.now().formatter();

  if (fichiersDuBucketSourceSansContenu.length) {
    getLogger().info(
      `🖊️ ${fichiersDuBucketSourceSansContenu.length} fichiers sur le bucket source sans contenu => Voir fichiers-du-bucket-source-sans-contenu-${now}.log`,
    );

    écrireFichierLog({
      name: `fichiers-du-bucket-source-sans-contenu-${now}.log`,
      contenu: fichiersDuBucketSourceSansContenu,
    });
  } else {
    getLogger().info('🖊️  Aucun fichier sans contenu sur le bucket source sans contenu');
  }

  if (fichiersDuBucketDestinationSansContenu.length > 0) {
    getLogger().info(
      `🖊️ ${fichiersDuBucketDestinationSansContenu.length} fichiers sur le bucket de destination sans contenu => Voir fichiers-du-bucket-destination-sans-contenu-${now}.log`,
    );

    écrireFichierLog({
      name: `fichiers-du-bucket-destination-sans-contenu-${now}.log`,
      contenu: fichiersDuBucketDestinationSansContenu,
    });
  } else {
    getLogger().info('🖊️  Aucun fichier sans contenu sur le bucket de destination sans contenu');
  }

  if (fichiersAvecContenuDifférent.length > 0) {
    getLogger().info(
      `🖊️  ${fichiersAvecContenuDifférent.length} fichiers avec contenu différent entre le bucket source et le bucket de destination => Voir fichiers-avec-contenu-différent-${now}.log`,
    );
    écrireFichierLog({
      name: `fichiers-avec-contenu-différent-${now}.log`,
      contenu: fichiersAvecContenuDifférent,
    });
  } else {
    getLogger().info(
      '🖊️  Aucun fichier avec contenu différent entre le bucket source et le bucket de destination',
    );
  }

  if (erreursDeTraitement.length > 0) {
    getLogger().info(
      `🖊️ ${erreursDeTraitement.length} fichiers sont en erreur de traitement avec contenu différent entre le bucket source et le bucket de destination => Voir erreurs-de-traitement-${now}.log`,
    );

    écrireFichierLog({
      name: `erreurs-de-traitement-${now}.log`,
      contenu: erreursDeTraitement,
    });
  } else {
    getLogger().info('🖊️ Aucun fichier en erreur de traitement');
  }

  if (fichiersSuccès.length > 0) {
    écrireFichierLog({
      name: `fichiers-succès-${now}.log`,
      contenu: fichiersSuccès,
    });

    if (fichiersSuccès.length === keys.length) {
      getLogger().info(
        `🎉 Tous les fichiers ont été déplacés avec succès => Voir fichiers-succès-${now}.log`,
      );
    } else {
      getLogger().info(
        `🖊️ ${fichiersSuccès.length} fichiers déplacés avec succès => Voir fichiers-succès-${now}.log`,
      );
    }
  } else {
    getLogger().info(
      `🖊️ Aucun fichier n'a pu être déplacé, merci de consulter les fichiers de logs d'erreurs`,
    );
  }
})();
