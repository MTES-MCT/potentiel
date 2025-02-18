import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanScalarStatistic = (type: string) => () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.scalar_statistic
  where type = $1
`,
    type,
  );
