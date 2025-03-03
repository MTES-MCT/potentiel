import { executeQuery } from '@potentiel-libraries/pg-helpers';

const statisticType = 'totalPuissanceProjetAvecMainlevéeAccordée';

export const computeTotalPuissanceProjetAvecMainlevéeAccordée = () =>
  executeQuery(
    `
    insert
    into 
      domain_public_statistic.scalar_statistic
    values(
      $1, 
      (
        select 
            sum(p."puissance") as "value" 
        from projects p
        where p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" in (
          select distinct(payload->>'identifiantProjet') from event_store.event_stream es where es.type like 'DemandeMainlevéeGarantiesFinancièresAccordée-V%'
        )
      )
    )
    `,
    statisticType,
  );
