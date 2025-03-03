import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalDCRDéposées';

export const computeNombreTotalDCRDéposées = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            count(p.key)
        from
            domain_views.projection p
        where 
            p.key like 'dossier-raccordement|%'
            and p.value->>'demandeComplèteRaccordement.accuséRéception.format' is not null
      )
    )
    `,
    statisticType,
  );
