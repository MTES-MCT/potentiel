import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { GetNombreDemandesÀInstruire } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const Mapper = {
  'changement-actionnaire': 'actionnaire',
  'changement-puissance': 'puissance',
  'changement-représentant-légal': 'représentantLégal',
  'demande-abandon': 'abandon',
  'demande-délai': 'délai',
  'demande-recours': 'recours',
} satisfies Record<string, AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction>;

type MapperKey = keyof typeof Mapper;

const domainesDreal: MapperKey[] = [
  'demande-abandon',
  'demande-délai',
  'changement-représentant-légal',
  'changement-puissance',
  'changement-actionnaire',
];

const domainesDgec: MapperKey[] = ['demande-abandon', 'demande-délai', 'demande-recours'];

export const getNombreDemandesÀInstruireAdapter: GetNombreDemandesÀInstruire = async (
  rôle,
  date,
  régions,
  userFilters,
) => {
  const domaines = rôle === 'dreal' ? domainesDreal : domainesDgec;
  const technologies = userFilters ? userFilters.technologie : undefined;
  const cycles = userFilters ? userFilters.cycle : undefined;

  // biome-ignore lint/suspicious/noExplicitAny: cas particulier
  const params: any[] = [rôle, date, domaines];

  let paramIndex = 4;

  const régionFilter = régions?.length
    ? (() => {
        params.push(régions);
        const placeholder = `$${paramIndex++}`;

        return `
        AND EXISTS (
          SELECT 1
          FROM domain_views.projection laur
          WHERE laur.key LIKE 'lauréat|%'
            AND laur.value->>'identifiantProjet' = p.value->>'identifiantProjet'
            AND laur.value->>'localité.région' = ANY(${placeholder})

          UNION ALL

          SELECT 1
          FROM domain_views.projection cand
          WHERE cand.key LIKE 'candidature|%'
            AND cand.value->>'identifiantProjet' = p.value->>'identifiantProjet'
            AND cand.value->>'statut' = 'éliminé'
            AND cand.value->>'localité.région' = ANY(${placeholder})
        )
      `;
      })()
    : '';

  const technologieFilter = technologies?.length
    ? (() => {
        params.push(technologies);
        return `AND cand.value->>'technologieCalculée' = ANY($${paramIndex++})`;
      })()
    : '';

  const cycleFilter = cycles?.length
    ? (() => {
        params.push(cycles.map((cycle) => `${cycle}%`));
        return `AND cand.value->>'appelOffre' LIKE ANY($${paramIndex++})`;
      })()
    : '';

  const result = await executeSelect<{
    domain: MapperKey;
    total: number;
    new: number;
  }>(
    `
    SELECT
      SPLIT_PART(p.key, '|', 1) AS domain,
      COUNT(*) AS total,
      COUNT(*) FILTER (
        WHERE p.value->>'demande.demandéLe' > $2
      ) AS new
    FROM domain_views.projection p
    WHERE SPLIT_PART(p.key, '|', 1) = ANY($3)
      AND p.value->>'statut' IN ('demandé', 'en-instruction', 'confirmé')
      AND p.value->>'autoritéCompétente' = $1
      ${régionFilter}
      ${
        technologieFilter || cycleFilter
          ? `
            AND EXISTS (
              SELECT 1
              FROM domain_views.projection cand
              WHERE cand.key LIKE 'candidature|%'
                AND cand.value->>'identifiantProjet' = p.value->>'identifiantProjet'
                ${technologieFilter}
                ${cycleFilter}
            )
          `
          : ''
      }
    GROUP BY 1
  `,
    ...params,
  );

  const résultats = domaines.map((domaine) => {
    return {
      domain: Mapper[domaine],
      total: 0,
      new: 0,
    };
  });

  for (const r of result) {
    const test = résultats.find((d) => d.domain === Mapper[r.domain]);
    if (test) {
      test.new = r.new;
      test.total = r.total;
      continue;
    }
    throw new Error(`Domaine ${r.domain} non trouvé dans les résultats`);
  }

  return résultats;
};
