import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanScalarStatistic = () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.scalar_statistic`,
  );
