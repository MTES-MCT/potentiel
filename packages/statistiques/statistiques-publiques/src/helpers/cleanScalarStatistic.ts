import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanScalarStatistic = async () => {
  await executeQuery(
    `
  delete
  from domain_public_statistic.scalar_statistic`,
  );
};
