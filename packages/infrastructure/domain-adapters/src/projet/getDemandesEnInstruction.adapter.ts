import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const Mapper: Record<string, AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction> = {
  'changement-actionnaire': 'actionnaire',
  'changement-puissance': 'puissance',
  'changement-représentant-légal': 'représentantLégal',
  'demande-abandon': 'abandon',
  'demande-délai': 'délai',
  'demande-recours': 'recours',
};

type Props = {
  régions: Array<string>;
  autoritéCompétente: 'dreal' | 'dgec';
};

export const getDemandesEnInstructionAdapter = async ({ régions, autoritéCompétente }: Props) => {
  const result = await executeSelect<Record<keyof typeof Mapper, string>>(
    `SELECT SPLIT_PART(p.key,'|',1) AS domain, count(*) FROM domain_views.projection p
  WHERE SPLIT_PART(p.key,'|',1) IN (
  'demande-abandon','demande-délai','changement-représentant-légal',
  'changement-puissance','changement-actionnaire','demande-recours'
)
AND p.value->>'statut' IN ('demandé', 'en-instruction', 'confirmé')
AND (p.value->>'demande.autoritéCompétente' = $1 OR p.value->>'demande.autoritéCompétente' IS NULL)
${
  régions.length
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
    autoritéCompétente,
    régions,
  );

  console.log(result);

  return result;
};
