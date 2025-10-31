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
              select 
                  sum((puiss.value->>'puissance')::float)
              from
                  domain_views.projection racc
                  join domain_views.projection puiss on puiss.key=format('puissance|%s',racc.value->>'identifiantProjet')
              where 
                    racc.key like 'raccordement|%'
                    and NOT EXISTS ( 
                        SELECT 1
                        FROM jsonb_array_elements(racc.value->'dossiers') AS dossier
                        WHERE dossier->'miseEnService'->>'dateMiseEnService' is null
                    )
                    AND jsonb_array_length(racc.value->'dossiers') > 0
            )
          )
          `,
    statisticType,
  );
};
