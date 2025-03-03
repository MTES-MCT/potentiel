import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanCartoProjetStatistic = () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.carto_projet_statistic
`,
  );
