import { executeSelect } from '@potentiel/pg-helpers';
import {
  AbandonAccordéPayload,
  AbandonAnnuléPayload,
  AbandonConfirméPayload,
  AbandonDemandéPayload,
  AbandonRejetéPayload,
  ConfirmationAbandonDemandéePayload,
  RejetAbandonAnnuléPayload,
} from '../../src/modules/demandeModification/demandeAbandon';
import { mediator } from 'mediateur';
import {
  ConfirmationAbandonDemandéRéponseSignée,
  AbandonAccordéRéponseSignée,
  DomainUseCase,
  PiéceJustificativeAbandon,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantUtilisateur,
  AbandonRejetéRéponseSignée,
} from '@potentiel/domain';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { extname, join } from 'path';
import { registerDemanderAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/demander/demanderAbandon.command';
import { registerDemanderAbandonAvecRecandidatureUseCase } from '../../packages/domain/src/projet/lauréat/abandon/demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/demander/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/demander/demanderConfirmationAbandon.usecase';
import { registerAccorderAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/annuler/annulerAbandon.usecase';
import { registerAnnulerRejetAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/annuler/annulerRejetAbandon.usecase';
import { registerConfirmerAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/confirmer/confirmerAbandon.usecase';
import { registerRejeterAbandonCommand } from '../../packages/domain/src/projet/lauréat/abandon/rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from '../../packages/domain/src/projet/lauréat/abandon/rejeter/rejeterAbandon.usecase';
import {
  ConsulterAbandonQuery,
  registerConsulterAbandonQuery,
} from '../../packages/domain-views/src/projet/lauréat/abandon/consulter/consulterAbandon.query';
import {
  ConsulterPiéceJustificativeAbandonProjetQuery,
  registerConsulterPiéceJustificativeAbandonProjetQuery,
} from '../../packages/domain-views/src/projet/lauréat/abandon/consulter/consulterPiéceJustificativeAbandon.query';

import { registerConsulterRéponseAbandonSignéeQuery } from '../../packages/domain-views/src/projet/lauréat/abandon/consulter/consulterRéponseSignéeAbandon.query';
import { AbandonDemandéEvent } from '../../packages/domain/src/projet/lauréat/abandon/abandon.event';
import {
  téléchargerPiéceJustificativeAbandonProjetAdapter,
  téléchargerRéponseSignéeAdapter,
  téléverserPiéceJustificativeAbandonAdapter,
  téléverserRéponseSignéeAdapter,
} from '@potentiel/infra-adapters';
import { publish, loadAggregate, loadFromStream } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { lookup } from 'mime-types';
import { isNone } from '@potentiel/monads';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const sourceEndPoint = '';
const sourceAccessKeyId = '';
const sourceSecretAccessKey = '';
const sourceBucketName = '';

const source = new S3({
  endpoint: sourceEndPoint,
  credentials: {
    accessKeyId: sourceAccessKeyId,
    secretAccessKey: sourceSecretAccessKey,
  },
  forcePathStyle: true,
});

const getFile = async (
  fichierId: string,
): Promise<
  | {
      format: string;
      content: ReadableStream;
    }
  | undefined
> => {
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

    const result = await source.send(
      new GetObjectCommand({
        Bucket: sourceBucketName,
        Key: sourceFilePath,
      }),
    );

    const content = result.Body?.transformToWebStream();
    const mimeType = lookup(extname(sourceFilePath));

    if (content) {
      return {
        format: mimeType ? mimeType : 'unknown',
        content,
      };
    }
  }
  return undefined;
};

const getEmail = async (userId: string) => {
  const user = await executeSelect<{ email: string }>(
    `SELECT email from "users" where id=$1`,
    userId,
  );

  if (user.length === 0) {
    throw new Error(`No user [${userId}]`);
  }

  return user[0].email;
};

const migrerAbandonDemandé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { justification, fichierId, porteurId }: AbandonDemandéPayload,
) => {
  const email = await getEmail(porteurId);

  let piéceJustificative: PiéceJustificativeAbandon | undefined;

  if (fichierId) {
    const file = await getFile(fichierId);
    if (file) {
      piéceJustificative = file;
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
      demandéPar: convertirEnIdentifiantUtilisateur(email),
    },
  });
};

const migrerAbandonAccordé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { accordéPar, fichierRéponseId }: AbandonAccordéPayload,
) => {
  const email = await getEmail(accordéPar);

  let réponseSignée: AbandonAccordéRéponseSignée | undefined;

  if (fichierRéponseId) {
    const file = await getFile(fichierRéponseId);
    if (file) {
      réponseSignée = {
        type: 'abandon-accordé',
        ...file,
      };
    }
  }

  if (réponseSignée) {
    await mediator.send<DomainUseCase>({
      type: 'ACCORDER_ABANDON_USECASE',
      data: {
        dateAccordAbandon: convertirEnDateTime(new Date(occurredAt)),
        identifiantProjet: convertirEnIdentifiantProjet({
          appelOffre,
          famille,
          numéroCRE: numeroCRE,
          période: periode,
        }),
        réponseSignée,
        accordéPar: convertirEnIdentifiantUtilisateur(email),
      },
    });
  } else {
    throw new Error('Réponse signée inexistante... cas impossible');
  }
};

const migrerAbandonAnnulé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { annuléPar }: AbandonAnnuléPayload,
) => {
  const email = await getEmail(annuléPar);

  await mediator.send<DomainUseCase>({
    type: 'ANNULER_ABANDON_USECASE',
    data: {
      dateAnnulationAbandon: convertirEnDateTime(new Date(occurredAt)),
      identifiantProjet: convertirEnIdentifiantProjet({
        appelOffre,
        famille,
        numéroCRE: numeroCRE,
        période: periode,
      }),
      annuléPar: convertirEnIdentifiantUtilisateur(email),
    },
  });
};

const migrerConfirmationAbandonDemandée = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { demandéePar, fichierRéponseId }: ConfirmationAbandonDemandéePayload,
) => {
  const email = await getEmail(demandéePar);

  let réponseSignée: ConfirmationAbandonDemandéRéponseSignée | undefined;

  if (fichierRéponseId) {
    const file = await getFile(fichierRéponseId);
    if (file) {
      réponseSignée = {
        type: 'abandon-à-confirmer',
        ...file,
      };
    }
  }

  if (réponseSignée) {
    await mediator.send<DomainUseCase>({
      type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
      data: {
        dateDemandeConfirmationAbandon: convertirEnDateTime(new Date(occurredAt)),
        identifiantProjet: convertirEnIdentifiantProjet({
          appelOffre,
          famille,
          numéroCRE: numeroCRE,
          période: periode,
        }),
        réponseSignée,
        confirmationDemandéePar: convertirEnIdentifiantUtilisateur(email),
      },
    });
  } else {
    throw new Error('Réponse signée inexistante... cas impossible');
  }
};

const migrerAbandonRejeté = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { rejetéPar, fichierRéponseId }: AbandonRejetéPayload,
) => {
  const email = await getEmail(rejetéPar);

  let réponseSignée: AbandonRejetéRéponseSignée | undefined;

  if (fichierRéponseId) {
    const file = await getFile(fichierRéponseId);
    if (file) {
      réponseSignée = {
        type: 'abandon-rejeté',
        ...file,
      };
    }
  }

  if (réponseSignée) {
    await mediator.send<DomainUseCase>({
      type: 'REJETER_ABANDON_USECASE',
      data: {
        dateRejetAbandon: convertirEnDateTime(new Date(occurredAt)),
        identifiantProjet: convertirEnIdentifiantProjet({
          appelOffre,
          famille,
          numéroCRE: numeroCRE,
          période: periode,
        }),
        réponseSignée,
        rejetéPar: convertirEnIdentifiantUtilisateur(email),
      },
    });
  } else {
    throw new Error('Réponse signée inexistante... cas impossible');
  }
};

const migrerAbandonConfirmé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { confirméPar }: AbandonConfirméPayload,
) => {
  const email = await getEmail(confirméPar);

  await mediator.send<DomainUseCase>({
    type: 'CONFIRMER_ABANDON_USECASE',
    data: {
      dateConfirmationAbandon: convertirEnDateTime(new Date(occurredAt)),
      identifiantProjet: convertirEnIdentifiantProjet({
        appelOffre,
        famille,
        numéroCRE: numeroCRE,
        période: periode,
      }),
      confirméPar: convertirEnIdentifiantUtilisateur(email),
    },
  });
};

const migrerRejetAbandonAnnulé = async (
  appelOffre: string,
  periode: string,
  famille: string,
  numeroCRE: string,
  occurredAt: string,
  { annuléPar }: RejetAbandonAnnuléPayload,
) => {
  const email = await getEmail(annuléPar);

  const identifiantProjet = convertirEnIdentifiantProjet({
    appelOffre,
    période: periode,
    famille,
    numéroCRE: numeroCRE,
  });

  const abandon = await mediator.send<ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON',
    data: {
      identifiantProjet,
    },
  });

  const piéceJustificative = await mediator.send<ConsulterPiéceJustificativeAbandonProjetQuery>({
    type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
    data: {
      identifiantProjet,
    },
  });

  if (isNone(abandon)) {
    throw new Error('Abandon inconnu');
  }

  const stream = await loadFromStream({
    streamId: `abandon|${appelOffre}#${periode}#${famille}#${numeroCRE}`,
  });

  const abandonDemandé = stream.find((e) => e.type === 'AbandonDemandé-V1');

  const demandéPar = abandonDemandé
    ? (abandonDemandé as unknown as AbandonDemandéEvent).payload.demandéPar
    : 'utilisateur inconnu';
  console.log(`🌠 ${demandéPar}`);

  await mediator.send<DomainUseCase>({
    type: 'ANNULER_REJET_ABANDON_USECASE',
    data: {
      dateAnnulationAbandon: convertirEnDateTime(new Date(occurredAt)),
      dateDemandeAbandon: convertirEnDateTime(abandon.demandeDemandéLe),
      demandéPar: convertirEnIdentifiantUtilisateur(demandéPar),
      annuléPar: convertirEnIdentifiantUtilisateur(email),
      identifiantProjet: convertirEnIdentifiantProjet({
        appelOffre,
        famille,
        numéroCRE: numeroCRE,
        période: periode,
      }),
      raison: abandon.demandeRaison,
      recandidature: abandon.demandeRecandidature,
      piéceJustificative: isNone(piéceJustificative) ? undefined : piéceJustificative,
    },
  });
};

(async () => {
  const eventIdInError: Map<string, string> = new Map();
  const dependencies = {
    loadAggregate,
    publish,
    enregistrerPiéceJustificativeAbandon: téléverserPiéceJustificativeAbandonAdapter,
    enregistrerRéponseSignée: téléverserRéponseSignéeAdapter,
  };
  registerDemanderAbandonCommand(dependencies);
  registerAccorderAbandonCommand(dependencies);
  registerConfirmerAbandonCommand(dependencies);
  registerDemanderConfirmationAbandonCommand(dependencies);
  registerRejeterAbandonCommand(dependencies);
  registerAnnulerAbandonCommand(dependencies);

  registerDemanderAbandonAvecRecandidatureUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();

  registerConsulterAbandonQuery({
    find: findProjection,
  });
  registerConsulterPiéceJustificativeAbandonProjetQuery({
    find: findProjection,
    récupérerPiéceJustificativeAbandon: téléchargerPiéceJustificativeAbandonProjetAdapter,
  });
  registerConsulterRéponseAbandonSignéeQuery({
    find: findProjection,
    récupérerRéponseSignée: téléchargerRéponseSignéeAdapter,
  });

  const historyPath = join(__dirname, 'history.json');
  const historyExists = existsSync(historyPath);
  let history: Array<string> = [];

  if (!historyExists) {
    writeFileSync(historyPath, JSON.stringify([]), {
      encoding: 'utf-8',
    });
  } else {
    history = JSON.parse(
      readFileSync(historyPath, {
        encoding: 'utf-8',
      }),
    ) as Array<string>;
  }

  const legacyEvents = await executeSelect<{
    id: string;
    appelOffre: string;
    periode: string;
    famille: string;
    numeroCRE: string;
    type: string;
    occurredAt: string;
    payload: unknown;
  }>(`
    select
      replace(projet.appelOffre::text, '"', '') as "appelOffre",
      replace(projet.periode::text, '"', '') as "periode",
      replace(projet.famille::text, '"', '') as "famille",
      replace(projet.numeroCRE::text, '"', '') as "numeroCRE",
      abandon.type,
      abandon.payload,
      abandon.id,
      abandon."occurredAt"
    from (
      select
        "id",
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

  const total = legacyEvents.length;
  let eventMigrated = 0;
  let index = 0;
  console.log(`🚨 ${total} à migrer`);
  for (const {
    id,
    appelOffre,
    famille,
    numeroCRE,
    occurredAt,
    payload,
    periode,
    type,
  } of legacyEvents) {
    index++;
    console.log('----------------------------');
    console.log(`ℹ ${index}/${total} - ${type} - ${id}`);

    if (history.includes(id)) {
      console.log('ℹ Skipped, already migrated');
    } else {
      const identifiantProjet = convertirEnIdentifiantProjet({
        appelOffre,
        famille,
        numéroCRE: numeroCRE,
        période: periode,
      });
      console.log(`ℹ ${identifiantProjet.formatter()}`);
      try {
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
            await migrerAbandonAccordé(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as AbandonAccordéPayload,
            );
            break;
          case 'AbandonAnnulé':
            await migrerAbandonAnnulé(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as AbandonAnnuléPayload,
            );
            break;
          case 'ConfirmationAbandonDemandée':
            await migrerConfirmationAbandonDemandée(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as ConfirmationAbandonDemandéePayload,
            );
            break;
          case 'AbandonConfirmé':
            await migrerAbandonConfirmé(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as AbandonConfirméPayload,
            );
            break;
          case 'AbandonRejeté':
            await migrerAbandonRejeté(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as AbandonRejetéPayload,
            );
            break;
          case 'RejetAbandonAnnulé':
            await migrerRejetAbandonAnnulé(
              appelOffre,
              periode,
              famille,
              numeroCRE,
              occurredAt,
              payload as RejetAbandonAnnuléPayload,
            );
            break;
          default:
            console.log(`⚠ Unknown type ${type}`);
        }
        console.log(`✅ Done`);
        eventMigrated++;
      } catch (e) {
        eventIdInError.set(id, e.message);
        console.log(
          `❌ ${e.message} - ${convertirEnIdentifiantProjet(
            identifiantProjet,
          ).formatter()} - EventId ${id}`,
        );
      }
      history.push(id);
      writeFileSync(historyPath, JSON.stringify(history), {
        encoding: 'utf-8',
      });
    }
    console.log('----------------------------');
  }

  if (eventIdInError.size > 0) {
    console.log(`❌ There are some errors`);
    console.table(eventIdInError);
  }

  console.log(`🏁 ${eventMigrated}/${total} migrated`);
})();
