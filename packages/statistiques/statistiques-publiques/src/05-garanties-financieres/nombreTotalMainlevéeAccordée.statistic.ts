import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalMainlevéeAccordée';

export const computeNombreTotalMainlevéeAccordée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(distinct(payload->>'identifiantProjet')) 
        from event_store.event_stream es 
          where es.type like 'DemandeMainlevéeGarantiesFinancièresAccordée-V%'
      )
    )
    `,
    statisticType,
  );
