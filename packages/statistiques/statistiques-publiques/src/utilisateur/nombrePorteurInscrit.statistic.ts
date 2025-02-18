import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const cleanNombrePorteurInscrit = () =>
  executeQuery(`
  delete
  from domain_public_statistic.scalar_statistic
  where type = 'nombrePorteurInscrit' 
`);

export const computeNombrePorteurInscrit = () =>
  executeQuery(
    `
    insert
    into domain_public_statistic.scalar_statistic
    values('nombrePorteurInscrit', (
      select
        count(*) as "count"
      from
        "public"."users"
      where
        "public"."users"."role" = 'porteur-projet'
    )
    `,
  );
