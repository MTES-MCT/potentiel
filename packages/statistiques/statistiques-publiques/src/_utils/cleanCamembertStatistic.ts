import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanCamembertStatistic = () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.camembert_statistic`,
  );
