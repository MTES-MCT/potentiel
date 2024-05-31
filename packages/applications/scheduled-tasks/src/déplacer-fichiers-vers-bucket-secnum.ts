import { S3, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { StreamingBlobPayloadOutputTypes } from '@smithy/types';
import { createWriteStream } from 'node:fs';

const sourceBucketName = process.env.S3_BUCKET || 'potentiel';
const destinationBucketName = process.env.S3_SECNUM_BUCKET || 'potentiel-secnum';

const getAllFileKeys = async (source: S3, nextMarker?: string) => {
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
    const nextKeys = await getAllFileKeys(source, NextMarker);
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

(async () => {
  getLogger().info('🏁 Moving production files to secnum S3 bucket');

  const source = new S3({
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
    },
    forcePathStyle: true,
  });

  const destination = new S3({
    endpoint: process.env.S3_SECNUM_ENDPOINT || 'http://localhost:9000',
    credentials: {
      accessKeyId: process.env.S3_SECNUM_AWS_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.S3_SECNUM_AWS_SECRET_ACCESS_KEY || 'minioadmin',
    },
    forcePathStyle: true,
  });

  const keys = await getAllFileKeys(source);

  if (keys.length === 0) {
    getLogger().warn('⚠️ No file keys found in the source bucket');
    process.exit();
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
      getLogger().info(`👉 ${count} / ${keys.length} - Déplacement du fichier ${key} 👈`);

      const { Body } = await récupérerContenuFichier({
        s3: source,
        bucketName: sourceBucketName,
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
        bucketName: sourceBucketName,
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
        bucketName: destinationBucketName,
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

  if (fichiersDuBucketSourceSansContenu.length) {
    écrireFichierLog({
      name: `fichiers-du-bucket-source-sans-contenu-${DateTime.now().formatter()}.log`,
      contenu: fichiersDuBucketSourceSansContenu,
    });
  }

  if (fichiersDuBucketDestinationSansContenu.length > 0) {
    écrireFichierLog({
      name: `fichiers-du-bucket-destination-sans-contenu-${DateTime.now().formatter()}.log`,
      contenu: fichiersDuBucketDestinationSansContenu,
    });
  }

  if (fichiersAvecContenuDifférent.length > 0) {
    écrireFichierLog({
      name: `fichiers-avec-contenu-différent-${DateTime.now().formatter()}.log`,
      contenu: fichiersAvecContenuDifférent,
    });
  }

  if (erreursDeTraitement.length > 0) {
    écrireFichierLog({
      name: `erreurs-de-traitement-${DateTime.now().formatter()}.log`,
      contenu: erreursDeTraitement,
    });
  }

  if (fichiersSuccès.length > 0) {
    écrireFichierLog({
      name: `fichiers-succès-${DateTime.now().formatter()}.log`,
      contenu: fichiersSuccès,
    });
  }
})();
