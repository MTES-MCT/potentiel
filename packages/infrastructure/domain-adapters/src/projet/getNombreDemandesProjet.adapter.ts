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
  régions,
  date,
) => {
  const result = await executeSelect<{ domaine: keyof typeof Mapper; count: number }>(
    `SELECT SPLIT_PART(p.key,'|',1) AS domaine, count(*) FROM domain_views.projection p
  WHERE SPLIT_PART(p.key,'|',1) IN (
  'demande-abandon','demande-délai','changement-représentant-légal',
  'changement-puissance','changement-actionnaire','demande-recours'
)
AND p.value->>'statut' IN ('demandé', 'en-instruction', 'confirmé')
AND (p.value->>'demande.autoritéCompétente' = $1 OR p.value->>'demande.autoritéCompétente' IS NULL)
${date ? `AND p.value->>'demande.demandéLe' << $3` : ''}
${
  régions?.length
    ? `
AND (
  EXISTS (
    SELECT 1 FROM domain_views.projection laur
    WHERE laur.key LIKE 'lauréat|%'
      AND laur.value->>'identifiantProjet' = p.value->>'identifiantProjet'
      AND laur.value->>'localité.région' = ANY($2)
  )
  OR EXISTS (
    SELECT 1 FROM domain_views.projection cand
    WHERE cand.key LIKE 'candidature|%'
      AND cand.value->>'identifiantProjet' = p.value->>'identifiantProjet'
      AND cand.value->>'statut' = 'éliminé'
      AND cand.value->>'localité.région' = ANY($2)
  )
)`
    : ''
}
GROUP BY 1`,
    rôle,
    ...(régions?.length ? régions : []),
    ...(date ? date : []),
  );

  const résultats = {
    actionnaire: { count: 0 },
    puissance: { count: 0 },
    représentantLégal: { count: 0 },
    abandon: { count: 0 },
    délai: { count: 0 },
    recours: { count: 0 },
  };

  for (const r of result) {
    résultats[Mapper[r.domaine]].count += Number(r.count);
  }

  return résultats;
};
