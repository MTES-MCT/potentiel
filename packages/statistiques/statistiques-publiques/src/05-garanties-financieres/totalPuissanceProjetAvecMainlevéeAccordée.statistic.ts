import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'totalPuissanceProjetAvecMainlevéeAccordée';

export const computeTotalPuissanceProjetAvecMainlevéeAccordée = async () => {
  await executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            sum( (puiss.value->>'puissance')::float) as "value"
        from
            domain_views.projection ml
            join domain_views.projection puiss on puiss.key=format('puissance|%s',ml.value->>'identifiantProjet')
        where 
            ml.key like 'mainlevee-garanties-financieres|%'
            and ml.value->>'statut'='accordé'
        )
    )
    `,
    statisticType,
  );
};
