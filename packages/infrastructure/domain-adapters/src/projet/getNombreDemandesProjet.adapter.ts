import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { GetNombreDemandesProjet } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const Mapper = {
  'changement-actionnaire': 'actionnaire',
  'changement-puissance': 'puissance',
  'changement-représentant-légal': 'représentantLégal',
  'demande-abandon': 'abandon',
  'demande-délai': 'délai',
  'demande-recours': 'recours',
} satisfies Record<string, AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction>;

export const getNombreDemandesProjetAdapter: GetNombreDemandesProjet = async (
  rôle,
  date,
  régions,
) => {
  const result = await executeSelect<{
    domaine: keyof typeof Mapper;
    total: number;
    new: number;
  }>(
    `SELECT
    SPLIT_PART(p.key,'|',1) AS domaine,
    count(*) AS total,
    count(*) FILTER (WHERE p.value->>'demande.demandéLe' > $2) AS new
  FROM domain_views.projection p
  WHERE SPLIT_PART(p.key,'|',1) IN (
    'demande-abandon','demande-délai','changement-représentant-légal',
    'changement-puissance','changement-actionnaire','demande-recours'
  )
  AND p.value->>'statut' IN ('demandé', 'en-instruction', 'confirmé')
  AND (p.value->>'demande.autoritéCompétente' = $1 OR p.value->>'demande.autoritéCompétente' IS NULL)
  ${
    régions?.length
      ? `
  AND (
    EXISTS (
      SELECT 1 FROM domain_views.projection laur
      WHERE laur.key LIKE 'lauréat|%'
        AND laur.value->>'identifiantProjet' = p.value->>'identifiantProjet'
        AND laur.value->>'localité.région' = ANY($3)
    )
    OR EXISTS (
      SELECT 1 FROM domain_views.projection cand
      WHERE cand.key LIKE 'candidature|%'
        AND cand.value->>'identifiantProjet' = p.value->>'identifiantProjet'
        AND cand.value->>'statut' = 'éliminé'
        AND cand.value->>'localité.région' = ANY($3)
    )
  )`
      : ''
  }
  GROUP BY 1`,
    rôle,
    date,
    ...(régions?.length ? [régions] : []),
  );

  const résultats = {
    actionnaire: { total: 0, new: 0 },
    puissance: { total: 0, new: 0 },
    représentantLégal: { total: 0, new: 0 },
    abandon: { total: 0, new: 0 },
    délai: { total: 0, new: 0 },
    recours: { total: 0, new: 0 },
  };

  for (const r of result) {
    résultats[Mapper[r.domaine]].total += r.total;
    résultats[Mapper[r.domaine]].new += r.new;
  }

  return résultats;
};
