import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'nombreDeDemandeParCategorie';

export const computeNombreDeDemandeParCategorie = async () => {
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
          where type like 'ChangementActionnaireDemandé-V%' or type like 'ChangementActionnaireEnregistré-V%'
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
      ),
      (
        $1,
        'puissance',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'ChangementPuissanceDemandé-V%' or type like 'ChangementPuissanceEnregistré-V%'
        )
      ),      
      (
        $1,
        'producteur',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'ChangementProducteurEnregistré-V%'
        )
      ),
      (
        $1,
        'fournisseur',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'ChangementFournisseurEnregistré-V%'
        )
      ),
      (
        $1,
        'delai',
        (
          select count(*) from "event_store"."event_stream" 
          where type like 'DélaiDemandé-V%'
        )
      )
    `,
    statisticType,
  );
};
