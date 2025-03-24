import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

void (async () => {
  await cleanStatistiquesPubliques();
  await computeStatistiquesPubliques();
  process.exit(0);
})();
