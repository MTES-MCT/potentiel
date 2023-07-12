import { appendFileSync } from 'fs';
import { downloadProductionFile, getAllProductionFiles } from './s3ProductionClient';
import {
  deleteStagingFile,
  getAllStagingFiles,
  updateStagingFile,
  uploadStagingFile,
} from './s3StagingClient';

(async () => {
  let errorsCount = 0;

  console.info(`📥 Getting all production files to sync with staging...`);
  const productionFiles = await getAllProductionFiles();
  console.info(`💡 ${productionFiles.length} files on production`);

  console.info(`📥 Getting all staging files to sync with staging...`);
  const stagingFiles = await getAllStagingFiles();
  console.info(`💡 ${stagingFiles.length} files on staging`);

  console.info(`Analizing files synchronisation...`);
  const filesToDelete = stagingFiles.filter((sf) => productionFiles.includes(sf));
  const filesToUpload = productionFiles.filter((pf) => stagingFiles.includes(pf));
  const filesToUpdate = productionFiles.filter(
    (pf) => !!stagingFiles.find((sf) => pf.key === sf.key && pf.eTag !== sf.eTag),
  );
  console.info(`💡 ${filesToDelete} files will be deleted on Staging`);
  console.info(`💡 ${filesToUpdate} files will be uploaded on Staging`);
  console.info(`💡 ${filesToDelete} files will be updated on Staging`);

  if (filesToDelete.length) {
    console.info(`💡 Deleting files...`);
  }
  await Promise.all(
    filesToDelete.map(async ({ key }) => {
      try {
        await deleteStagingFile(key);
      } catch (error) {
        errorsCount++;
        appendFileSync(
          './s3-sync.log',
          `${new Date().toISOString()} - ${JSON.stringify(error)}\n`,
          {
            encoding: 'utf-8',
          },
        );
      }
    }),
  );

  if (filesToUpload.length) {
    console.info(`💡 Uploading files...`);
  }
  await Promise.all(
    filesToUpload.map(async ({ key }) => {
      try {
        const fileContent = await downloadProductionFile(key);
        await uploadStagingFile(key, fileContent);
      } catch (error) {
        errorsCount++;
        appendFileSync(
          './s3-sync.log',
          `${new Date().toISOString()} - ${JSON.stringify(error)}\n`,
          {
            encoding: 'utf-8',
          },
        );
      }
    }),
  );

  if (filesToUpdate.length) {
    console.info(`💡 Updating files...`);
  }
  await Promise.all(
    filesToUpdate.map(async ({ key }) => {
      try {
        const fileContent = await downloadProductionFile(key);
        await updateStagingFile(key, fileContent);
      } catch (error) {
        errorsCount++;
        appendFileSync(
          './s3-sync.log',
          `${new Date().toISOString()} - ${JSON.stringify(error)}\n`,
          {
            encoding: 'utf-8',
          },
        );
      }
    }),
  );

  if (errorsCount === 0) {
    console.log('✅✅✅✅✅✅✅✅✅ All good !');
  } else {
    console.log(`${errorsCount} errors occured during sync, see ./s3-sync.log`);
  }
})();
