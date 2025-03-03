import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanUtilisateurStatistic = () =>
  executeQuery(
    `
  delete
  from domain_public_statistic.utilisateur_creation_statistic
`,
  );
