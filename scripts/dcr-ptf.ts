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

process.env.EVENT_STORE_CONNECTION_STRING = '';

const bucketName = '';
const client = new S3({
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: '',
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

  for (const { key } of dossiers) {
    try {
      console.log('---------------------------------------------');
      console.log(`ℹ️ Start processing: ${key}`);
      const [, appelOffre, période, famille, numéroCRE, référenceDossierRaccordement] =
        key.split('#');
      const identifiantProjet = { appelOffre, période, famille, numéroCRE };
      const identifiantProjetFormaté = formatIdentifiantProjet(identifiantProjet);
      console.log(`ℹ️ Identifiant Projet: ${identifiantProjetFormaté}`);
      const aggregateId = createRaccordementAggregateId(identifiantProjet);
      console.log(`ℹ️ Aggregate id: ${aggregateId}`);

      const dcrPath = join(
        identifiantProjetFormaté,
        référenceDossierRaccordement,
        'demande-complete-raccordement',
      );
      console.log(`ℹ️ dcrPath: ${dcrPath}`);
      const pftPath = join(
        identifiantProjetFormaté,
        référenceDossierRaccordement,
        'proposition-technique-et-financiere',
      );
      console.log(`ℹ️ pftPath: ${pftPath}`);

      const dcrFiles = await getFiles(dcrPath);
      const ptfFiles = await getFiles(pftPath);

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
        console.log(`Mime-type: ${mimeType}`);
        const event: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
          type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
          payload: {
            identifiantProjet: identifiantProjetFormaté,
            référenceDossierRaccordement,
            format: mimeType ? mimeType : 'unknown',
          },
        };

        await publish(aggregateId, event);
        console.log(`ℹ️ 🔌 AccuséRéceptionDemandeComplèteRaccordementTransmisEvent sent`);

        await acDCREventHandler(event);
        console.log(`ℹ️ 📁 Dossier Raccordement projection updated`);
      }

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
        console.log(`Mime-type: ${mimeType}`);
        const event: PropositionTechniqueEtFinancièreSignéeTransmiseEvent = {
          type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
          payload: {
            identifiantProjet: identifiantProjetFormaté,
            référenceDossierRaccordement,
            format: mimeType ? mimeType : 'unknown',
          },
        };

        await publish(aggregateId, event);

        console.log(`ℹ️ 📜 PropositionTechniqueEtFinancièreSignéeTransmiseEvent sent`);
        await ptfSignéeEventHandler(event);
        console.log(`ℹ️ 📁 Dossier Raccordement projection updated`);
        console.log(`✅ Done !`);
      }
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
