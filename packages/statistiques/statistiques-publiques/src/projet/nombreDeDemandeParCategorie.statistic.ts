import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { cleanCamembertStatistic } from '../_utils/cleanCamembertStatistic';

const statisticType = 'nombreDeDemandeParCategorie';

export const cleanNombreDeDemandeParCategorie = cleanCamembertStatistic(statisticType);

export const computeNombreDeDemandeParCategorie = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.camembert_statistic
    select
      $1 as "type",
      "type" as "category",
      count(*) as "value"
    from
      "modificationRequests"
    where "type" in ('delai', 'puissance', 'producteur', 'fournisseur')
    group by "type"
    `,
    statisticType,
  );

  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.camembert_statistic
    values
      (
        $1,
        'abandon',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'AbandonDemandé-V%'
        )
      ),
      (
        $1,
        'actionnaire',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'ChangementActionnaireDemandé-V%'
        )
      ),
      (
        $1,
        'représentant légal',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'ChangementReprésentantLégalDemandé-V%'
        )
      ),
      (
        $1,
        'recours',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'RecoursDemandé-V%'
        )
      )
    `,
    statisticType,
  );
};
