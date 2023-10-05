import { executeSelect } from '@potentiel/pg-helpers';
import { AbandonDemandéPayload } from '../../src/modules/demandeModification/demandeAbandon';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  PiéceJustificativeAbandon,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { ConsulterAbandonQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { extname } from 'path';

const sourceEndPoint = '';
const sourceAccessKeyId = '';
const sourceSecretAccessKey = '';
const sourceBucketName = 'potentiel-production';
const source = new S3({
  endpoint: sourceEndPoint,
  credentials: {
    accessKeyId: sourceAccessKeyId,
    secretAccessKey: sourceSecretAccessKey,
  },
  forcePathStyle: true,
});

const getFile = async (path: string) => {
  const result = await source.send(
    new GetObjectCommand({
      Bucket: sourceBucketName,
      Key: path,
    }),
  );
  return result.Body?.transformToWebStream();
};

const migrerAbandonDemandé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { justification, fichierId }: AbandonDemandéPayload,
) => {
  let piéceJustificative: PiéceJustificativeAbandon | undefined;

  if (fichierId) {
    const files = await executeSelect<{ sourceFilePath: string }>(
      `
      SELECT
        REPLACE(f."storedAt", 'S3:potentiel-production:', '') AS "sourceFilePath"
      FROM files f
      WHERE id=$1`,
      fichierId || '',
    );

    if (files.length > 0) {
      const { sourceFilePath } = files[0];
      const content = await getFile(sourceFilePath);
      const format = extname(sourceFilePath);

      if (content) {
        piéceJustificative = {
          format,
          content,
        };
      }
    }
  }

  await mediator.send<DomainUseCase>({
    type: 'DEMANDER_ABANDON_USECASE',
    data: {
      dateDemandeAbandon: convertirEnDateTime(new Date(occurredAt)),
      identifiantProjet: convertirEnIdentifiantProjet({
        appelOffre,
        famille,
        numéroCRE: numeroCRE,
        période: periode,
      }),
      raison: justification || '',
      recandidature: false,
      piéceJustificative,
    },
  });
};

(async () => {
  const legacyEvents = await executeSelect<{
    appelOffre: string;
    periode: string;
    famille: string;
    numeroCRE: string;
    type: string;
    occurredAt: string;
    payload: unknown;
  }>(`
    select
      projet.appelOffre::text as "appelOffre",
      projet.periode::text as "periode",
      projet.famille::text as "famille",
      projet.numeroCRE::text as "numeroCRE",
      abandon.type,
      abandon.payload,
      abandon."occurredAt"
    from (
      select
        "type",
        "occurredAt",
        "payload",
        "payload"->'projetId' as projetId
      from "eventStores"
      where "type" in ('AbandonDemandé', 'AbandonAccordé', 'AbandonAnnulé', 'ConfirmationAbandonDemandée', 'AbandonConfirmé' , 'AbandonRejeté', 'RejetAbandonAnnulé')
    ) as abandon
    inner join (
      select
        "payload"->'appelOffreId' as appelOffre,
        "payload"->'periodeId' as periode,
        "payload"->'familleId' as famille,
        "payload"->'numeroCRE' as numeroCRE,
        "payload"->'projectId' as projetId
      from "eventStores"
      where "type" in ('ProjectImported', 'LegacyProjectSourced')
    ) as projet on abandon.projetId::text = projet.projetId::text
    order by abandon."occurredAt"
  `);

  for (const {
    appelOffre,
    famille,
    numeroCRE,
    occurredAt,
    payload,
    periode,
    type,
  } of legacyEvents) {
    const abandon = await mediator.send<ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet({
          appelOffre,
          famille,
          numéroCRE: numeroCRE,
          période: periode,
        }),
      },
    });

    if (isNone(abandon)) {
      switch (type) {
        case 'AbandonDemandé':
          await migrerAbandonDemandé(
            appelOffre,
            periode,
            famille,
            numeroCRE,
            occurredAt,
            payload as AbandonDemandéPayload,
          );
          break;
        case 'AbandonAccordé':
          break;
        case 'AbandonDemandé':
          break;
        case 'AbandonAnnulé':
          break;
        case 'ConfirmationAbandonDemandée':
          break;
        case 'AbandonConfirmé':
          break;
        case 'AbandonRejeté':
          break;
        case 'RejetAbandonAnnulé':
          break;
        default:
          console.log(`⚠ Unknown type ${type}`);
      }
    }
  }
})();
