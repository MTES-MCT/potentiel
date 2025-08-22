import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreTotalDemande';

export const computeNombreTotalDemande = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
          count(*) 
        from 
          "event_store"."event_stream" 
        where type like any (array[
          'AbandonDemandé-V%', 
          'ChangementActionnaireDemandé-V%', 
          'ChangementReprésentantLégalDemandé-V%',
          'RecoursDemandé-V%', 
          'ChangementPuissanceDemandé-V%',
          'ChangementActionnaireEnregistré-V%', 
          'ChangementPuissanceEnregistré-V%', 
          'ChangementProducteurEnregistré-V%',
          'ChangementFournisseurEnregistré-V%', 
          'DélaiDemandé-V%'
        ])
      )
    )
    `,
    statisticType,
  );
};
