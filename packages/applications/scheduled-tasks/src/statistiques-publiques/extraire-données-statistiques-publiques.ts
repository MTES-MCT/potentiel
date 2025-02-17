import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-applications/statistiques-publiques';

(async () => {
  await cleanStatistiquesPubliques();
  await computeStatistiquesPubliques();
})();
