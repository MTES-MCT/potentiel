import { downloadProductionFile, getAllProductionFiles } from './s3ProductionClient';
import { getStagingObject, updateStagingFile, uploadStagingFile } from './s3StagingClient';

(async () => {
  const warningOrError: Array<
    { type: 'error'; error: Error } | { type: 'warning'; messages: string[] }
  > = [];

  console.info(`📥 Getting all production files to sync with staging...`);
  const productionFiles = await getAllProductionFiles();
  console.info(`💡 ${productionFiles.length} files to sync with staging !`);

  let fileSyncedCount = 0;
  for (const { key, lastModified } of productionFiles) {
    fileSyncedCount++;

    console.info(`💡 Syncing file ${fileSyncedCount}/${productionFiles.length}`);
    try {
      const stagingFile = await getStagingObject(key);

      if (stagingFile) {
        if (
          stagingFile.LastModified &&
          stagingFile.LastModified.getTime() < lastModified.getTime()
        ) {
          console.info(`💡 Staging file ${key} exists but is obsolete`);

          console.info(`📥 Downloading file ${key} ...`);
          const fileContent = await downloadProductionFile(key);

          console.info(`📨 Updating file ${key} on staging`);
          await updateStagingFile(key, fileContent);
          console.info(`✅ File ${key} updated on staging`);
        }

        continue;
      }

      console.info(`💡 Staging file ${key} does not exist`);

      console.info(`📥 Downloading file ${key} ...`);
      const fileContent = await downloadProductionFile(key);

      console.info(`📨 Uploading file ${key} on staging`);
      await uploadStagingFile(key, fileContent);
      console.info(`✅ File ${key} uploaded on staging`);
    } catch (error) {
      //   console.log(`❌ error: ${error}`);
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
