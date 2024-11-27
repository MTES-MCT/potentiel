import { executeSelect } from '@potentiel-libraries/pg-helpers';

const getRelevantModificationRequest = async () => {
  return await executeSelect<ModificationRequested>(`
SELECT mr.*
FROM "modificationRequests" AS mr
JOIN "projects" AS p ON mr."projectId" = p.id
WHERE mr.type = 'actionnaire'
  AND (mr.status = 'envoyée' OR mr.status = 'en instruction')
  AND p."appelOffreId" <> 'Eolien';
`);
};

(async () => {
  console.log('✨ Script actionnaire');

  const modificationRequestToUpdate = await getRelevantModificationRequest();

  console.log(`There is ${modificationRequestToUpdate.length} to update`);

  process.exit(0);
})();
