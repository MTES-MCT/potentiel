import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

(async () => {
  await cleanStatistiquesPubliques();
  await computeStatistiquesPubliques();
})();
