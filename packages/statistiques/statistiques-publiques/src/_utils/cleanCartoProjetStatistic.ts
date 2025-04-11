import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanCartoProjetStatistic = async () => {
  await executeQuery(
    `
  delete
  from domain_public_statistic.carto_projet_statistic
`,
  );
};
