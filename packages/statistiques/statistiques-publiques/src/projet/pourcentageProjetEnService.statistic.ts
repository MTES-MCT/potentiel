import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'pourcentageProjetEnService';

export const cleanPourcentageProjetEnService = cleanScalarStatistic(statisticType);

export const computePourcentageProjetEnService = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          ((
            select 
              count(distinct p.value->>'identifiantProjet')
            from
              domain_views.projection p
              where 
                p.key like 'dossier-raccordement|%'
                and p.value->>'miseEnService.dateMiseEnService' is not null
          )::decimal
        /        
          (
            select
              count(distinct(es.stream_id))
            from
              event_store.event_stream es
            where 
              es.type like 'LauréatNotifié-V%' and 
              es.payload->>'identifiantProjet' not in (
                select
                  distinct(payload->>'identifiantProjet')
                from
                  event_store.event_stream es
                where es.type like 'AbandonAccordé-V%'
              )
          )::decimal) * 100
      )
    )
    `,
    statisticType,
  );
