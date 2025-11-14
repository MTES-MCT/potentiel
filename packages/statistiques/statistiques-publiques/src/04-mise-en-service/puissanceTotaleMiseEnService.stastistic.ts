import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'puissanceTotaleMiseEnService';

export const computePuissanceTotaleMiseEnService = async () => {
  await executeQuery(
    `
          insert
          into 
            domain_public_statistic.scalar_statistic
          values(
            $1, 
            (             
              with raccordements_en_service AS (
              select 
                distinct racc.value->>'identifiantProjet' as identifiantProjet
              from
                  domain_views.projection racc
              where 
                  racc.key like 'dossier-raccordement|%'
                  and value->>'miseEnService.dateMiseEnService' is not null
              except
              select 
                distinct racc.value->>'identifiantProjet' as identifiantProjet
              from
                  domain_views.projection racc
              where 
                  racc.key like 'dossier-raccordement|%'
                  and value->>'miseEnService.dateMiseEnService' is null
            )
            select 
                  sum((puiss.value->>'puissance')::float)
              from
                  domain_views.projection racc
                  inner join raccordements_en_service dossier on dossier.identifiantProjet = racc.value->>'identifiantProjet'
                  join domain_views.projection puiss on puiss.key=format('puissance|%s',racc.value->>'identifiantProjet')
              where 
                    racc.key like 'raccordement|%'
              )
          )
          `,
    statisticType,
  );
};
