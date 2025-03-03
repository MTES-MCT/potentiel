import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalDemande';

export const computeNombreTotalDemande = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          (select count(*) from "modificationRequests" where "type" in ('delai', 'puissance', 'producteur', 'fournisseur'))
          + 
            (select count(*) from "event_store"."event_stream" 
            where type like any (array['AbandonDemandé-V%', 'ChangementActionnaireDemandé-V%', 'ChangementReprésentantLégalDemandé-V%', 'RecoursDemandé-V%']))
      )
    )
    `,
    statisticType,
  );
