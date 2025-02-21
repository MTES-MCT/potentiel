import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanCamembertStatistic = (type: string) => () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.camembert_statistic
  where type = $1
`,
    type,
  );
