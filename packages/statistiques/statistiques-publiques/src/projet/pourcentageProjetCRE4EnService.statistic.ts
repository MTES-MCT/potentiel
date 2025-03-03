import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanScalarStatistic } from '../_utils/cleanScalarStatistic';

const statisticType = 'pourcentageProjetCRE4EnService';

export const cleanPourcentageProjetCRE4EnService = cleanScalarStatistic(statisticType);

export const computePourcentageProjetCRE4EnService = () =>
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
              count(distinct p1.value->>'identifiantProjet')
            from
              domain_views.projection p1
            join 
              domain_views.projection p2 
                on split_part(p1.value->>'identifiantProjet', '#', 1) = p2.value->>'id' 
                and p2.key like 'appel-offre|%'
            where 
                p1.key like 'dossier-raccordement|%' 
                and p1.value->>'miseEnService.dateMiseEnService' is not null
                and p2."value"->>'cycleAppelOffre' = 'CRE4'
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
