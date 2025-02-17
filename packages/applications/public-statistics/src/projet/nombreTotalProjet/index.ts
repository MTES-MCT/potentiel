import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanNombreTotalProjet = () =>
  executeQuery(`
  delete
  from domain_public_statistic.scalar_statistic
  where type = 'nombreTotalProjet' 
`);

export const computeNombreTotalProjet = () =>
  executeQuery(
    `
    insert
    into domain_public_statistic.scalar_statistic
    values('nombreTotalProjet', (
      select
        count(*)
      from
        domain_views.projection 
      where key like 'candidature|%'))
    `,
  );
