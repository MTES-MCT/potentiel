import { executeSelect } from '@potentiel/pg-helpers';
import {
  DossierRaccordementReadModel,
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
  propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';
import { findProjection, updateProjection } from '@potentiel/pg-projections';
import { S3 } from 'aws-sdk';
import { extname, join } from 'path';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '@potentiel/domain/dist/raccordement/demandeCompléteRaccordement/enregisterAccuséRéception/accuséRéceptionDemandeComplèteRaccordementTransmis.event';
import { formatIdentifiantProjet } from '@potentiel/domain/dist/projet/identifiantProjet';
import { createRaccordementAggregateId } from '@potentiel/domain/dist/raccordement/raccordement.aggregate';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '@potentiel/domain/dist/raccordement/propositionTechniqueEtFinancière/enregistrerPropositionTechniqueEtFinancièreSignée/propositionTechniqueEtFinancièreSignéeTransmise.event';
import { lookup } from 'mime-types';

process.env.EVENT_STORE_CONNECTION_STRING =
  'postgres://potadmindb:localpwd@localhost:5432/potentiel';

const bucketName = 'potentiel';
const client = new S3({
  endpoint: 'http://localhost:9444/s3',
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  s3ForcePathStyle: true,
});

export const getFiles = async (pattern: string): Promise<string[]> => {
  const files = await client.listObjects({ Bucket: bucketName, Prefix: pattern }).promise();

  if (!files.Contents || files.Contents.length === 0 || !files.Contents[0].Key) {
    return [];
  }

  return files.Contents.map((file) => file.Key || undefined).filter((file) => file) as string[];
};

const acDCREventHandler = accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory({
  find: findProjection,
  update: updateProjection,
});

const ptfSignéeEventHandler = propositionTechniqueEtFinancièreSignéeTransmiseHandlerFactory({
  find: findProjection,
  update: updateProjection,
});

(async () => {
  const warningOrError: Array<
    { type: 'error'; error: Error } | { type: 'warning'; messages: string[] }
  > = [];
  const dossiers = await executeSelect<{
    key: `dossier-raccordement#${string}`;
    value: Omit<DossierRaccordementReadModel, 'type'>;
  }>(`
    SELECT "key", "value"
    FROM "PROJECTION"
    WHERE "key" LIKE 'dossier-raccordement#%'
  `);

  const total = dossiers.length;

  console.log(`ℹ️ Nb dossiers: ${total}`);

  for (const dossier of dossiers) {
    try {
      console.log('---------------------------------------------');
      const { key } = dossier;
      console.log(`ℹ️ ${dossiers.indexOf(dossier) + 1}/${total} Start processing: ${key}`);
      const [, appelOffre, période, famille, numéroCRE, référenceDossierRaccordement] =
        key.split('#');
      const identifiantProjet = { appelOffre, période, famille, numéroCRE };
      const identifiantProjetFormaté = formatIdentifiantProjet(identifiantProjet);
      console.log(`ℹ️ Identifiant Projet: ${identifiantProjetFormaté}`);
      const aggregateId = createRaccordementAggregateId(identifiantProjet);
      console.log(`ℹ️ Aggregate id: ${aggregateId}`);

      if (!dossier.value.accuséRéception?.format) {
        console.log(`⏩🔌 Updating DCR format`);
        const dcrPath = join(
          identifiantProjetFormaté,
          référenceDossierRaccordement,
          'demande-complete-raccordement',
        );
        console.log(`ℹ️ dcrPath: ${dcrPath}`);
        const dcrFiles = await getFiles(dcrPath);

        if (dcrFiles.length > 0) {
          if (dcrFiles.length > 1) {
            console.log(`⚠️ Multiple DRC found`);
            warningOrError.push({
              type: 'warning',
              messages: ['Multiple DCR', ...dcrFiles],
            });
          }

          const dcrFile = dcrFiles[0];
          console.log(`ℹ️ DCR File: ${dcrFile}`);
          const mimeType = lookup(extname(dcrFile));
          console.log(`ℹ️ Mime-type: ${mimeType}`);
          const event: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
            type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
            payload: {
              identifiantProjet: identifiantProjetFormaté,
              référenceDossierRaccordement,
              format: mimeType ? mimeType : 'unknown',
            },
          };

          await publish(aggregateId, event);
          console.log(`⏩✅ 🔌 AccuséRéceptionDemandeComplèteRaccordementTransmisEvent sent`);

          await acDCREventHandler(event);
          console.log(`⏩✅ 📁 Dossier Raccordement projection updated`);
        } else {
          console.log(`ℹ️ No DCR file`);
        }
      } else {
        console.log(`ℹ️ DCR format already updated`);
      }

      if (!dossier.value.propositionTechniqueEtFinancière?.format) {
        console.log(`⏩📜 Updating PTF format`);
        const pftPath = join(
          identifiantProjetFormaté,
          référenceDossierRaccordement,
          'proposition-technique-et-financiere',
        );
        console.log(`ℹ️ pftPath: ${pftPath}`);

        const ptfFiles = await getFiles(pftPath);

        if (ptfFiles.length > 0) {
          if (ptfFiles.length > 1) {
            console.log(`⚠️ Multiple PTF found`);
            warningOrError.push({
              type: 'warning',
              messages: ['Multiple PTF', ...ptfFiles],
            });
          }
          const ptfFile = ptfFiles[0];
          console.log(`ℹ️ PTF File: ${ptfFile}`);
          const mimeType = lookup(extname(ptfFile));
          console.log(`ℹ️ Mime-type: ${mimeType}`);
          const event: PropositionTechniqueEtFinancièreSignéeTransmiseEvent = {
            type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
            payload: {
              identifiantProjet: identifiantProjetFormaté,
              référenceDossierRaccordement,
              format: mimeType ? mimeType : 'unknown',
            },
          };

          await publish(aggregateId, event);

          console.log(`⏩✅ 📜 PropositionTechniqueEtFinancièreSignéeTransmiseEvent sent`);
          await ptfSignéeEventHandler(event);
          console.log(`⏩✅ 📁 Dossier Raccordement projection updated`);
        } else {
          console.log(`ℹ️ No PTF file`);
        }
      } else {
        console.log(`ℹ️ PTF format already updated`);
      }

      console.log(`✅ Done !`);
    } catch (error) {
      console.log(`❌ error: ${error.message}`);
      warningOrError.push({
        type: 'error',
        error,
      });
    }
  }

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('Report');

  if (!warningOrError.length) {
    console.log('✅✅✅✅✅✅✅✅✅ All good !');
  }

  for (const wOe of warningOrError) {
    if (wOe.type === 'error') {
      console.log('❌ Error');
      console.error(wOe.error);
      console.log('');
    } else {
      console.log('⚠️ Warning');
      wOe.messages.forEach((m) => console.log(m));
      console.log('');
    }
  }
})();
