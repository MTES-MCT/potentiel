import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanCamembertStatistic = async () => {
  await executeQuery(
    `
  delete
  from domain_public_statistic.camembert_statistic`,
  );
};
