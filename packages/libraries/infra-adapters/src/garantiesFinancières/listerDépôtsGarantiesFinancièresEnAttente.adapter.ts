import {
  ListerDépôtsGarantiesFinancièresEnAttentePort,
  ProjetReadModel,
} from '@potentiel/domain-views';
import { executeSelect } from '@potentiel/pg-helpers';

export const listerDépôtsGarantiesFinancièresEnAttenteAdapter: ListerDépôtsGarantiesFinancièresEnAttentePort =
  async ({ région, pagination: { itemsPerPage, page } }) => {
    const items: {
      dateLimiteDépôt?: string;
      projet: Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire' | 'statut'>;
    }[] = await executeSelect(
      `
    SELECT 
      gf.value->>'dateLimiteDépôt' as "dateLimiteDépôt",  
      json_build_object(
        'appelOffre', p."appelOffreId",
        'période', p."periodeId",
        'famille', p."familleId",
        'numéroCRE', p."numeroCRE",
        'identifiantProjet', gf.value->>'identifiantProjet',
        'legacyId', p.id,
        'nom', p."nomProjet",
        'localité', json_build_object('commune', p."communeProjet", 'département', p."departementProjet", 'région', p."regionProjet")
        ) as "projet"
    FROM domain_views.projection gf
    JOIN projects p
    ON gf.value->>'identifiantProjet' = p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"
    WHERE key LIKE $1
      AND gf.value->>'région' LIKE $2
      AND gf.value->>'statutDépôt' = $3
      AND p."abandonedOn" = $4
      AND p.classe = $5
    LIMIT $6
    OFFSET $7`,
      `suivi-dépôt-garanties-financières|%`,
      `%${région}%`,
      'en attente',
      0,
      'Classé',
      itemsPerPage,
      page <= 1 ? 0 : (page - 1) * itemsPerPage,
    );

    const totalCount = await executeSelect(
      `
    SELECT COUNT(key) "totalItems"
    FROM domain_views.projection gf
    JOIN projects p
    ON gf.value->>'identifiantProjet' = p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE"
    WHERE key LIKE $1
      AND gf.value->>'région' LIKE $2
      AND gf.value->>'statutDépôt' = $3
      AND p."abandonedOn" = $4
      AND p.classe = $5
    LIMIT $6
    OFFSET $7`,
      `suivi-dépôt-garanties-financières|%`,
      `%${région}%`,
      'en attente',
      0,
      'Classé',
      itemsPerPage,
      page <= 1 ? 0 : (page - 1) * itemsPerPage,
    );

    return { items, totalCount: parseInt(totalCount[0].totalItems as string) };
  };
