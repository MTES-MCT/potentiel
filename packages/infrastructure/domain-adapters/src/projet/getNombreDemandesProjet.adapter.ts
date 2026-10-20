import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { Email } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getScopeProjetUtilisateurAdapter } from '../index.js';

const Mapper: Record<string, AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction> = {
  'changement-actionnaire': 'actionnaire',
  'changement-puissance': 'puissance',
  'changement-représentant-légal': 'représentantLégal',
  'demande-abandon': 'abandon',
  'demande-délai': 'délai',
  'demande-recours': 'recours',
};

type Props = {
  utilisateur: string;
  rôle: 'dreal' | 'dgec';
};

export const getNombreDemandesProjetAdapter = async ({ utilisateur, rôle }: Props) => {
  const scope = await getScopeProjetUtilisateurAdapter(Email.convertirEnValueType(utilisateur));

  console.log('scope', scope);

  const result = await executeSelect<Record<keyof typeof Mapper, string>>(
    `SELECT SPLIT_PART(p.key,'|',1) AS domain, count(*) FROM domain_views.projection p
  WHERE SPLIT_PART(p.key,'|',1) IN (
  'demande-abandon','demande-délai','changement-représentant-légal',
  'changement-puissance','changement-actionnaire','demande-recours'
)
AND p.value->>'statut' IN ('demandé', 'en-instruction', 'confirmé')
AND (p.value->>'demande.autoritéCompétente' = $1 OR p.value->>'demande.autoritéCompétente' IS NULL)
${
  scope?.régions?.length
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
    scope.régions,
  );

  console.log(result);

  return result;
};
