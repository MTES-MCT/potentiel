import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const Map: Record<AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction, string> = {
  actionnaire: 'changement-actionnaire',
  puissance: 'changement-puissance',
  représentantLégal: 'changement-représentant-légal',
  abandon: 'demande-abandon',
  délai: 'demande-délai',
  recours: 'demande-recours',
};

const query = `SELECT SPLIT_PART(p.key,'|',1) domain, count(*)
FROM domain_views.projection p
WHERE SPLIT_PART(p.key,'|',1) in ('demande-abandon','demande-délai','changement-représentant-légal','changement-puissance', 'changement-actionnaire', 'demande-recours')
AND p.value->>'statut' in ('demandé', 'en-instruction', 'confirmé')
AND p.value->>'demande.autoritéCompétence'
group by 1`;

export const getDemandesEnInstructionAdapteur = async (scope?: ...) => {


  // autoritéCompétente
// région lauréat


  const params = {autoritécompétence: 'dreal', région: ['Ile de France']}
  

  await executeQuery(
`SELECT SPLIT_PART(p.key,'|',1) domain, count(*)
FROM domain_views.projection p
${params ? "and ao.value->>'cycleAppelOffre' = $2" : ''}
WHERE SPLIT_PART(p.key,'|',1) in ('demande-abandon','demande-délai','changement-représentant-légal','changement-puissance', 'changement-actionnaire', 'demande-recours')
AND p.value->>'statut' in ('demandé', 'en-instruction', 'confirmé')
AND p.value->>'demande.autoritéCompétence'=$1
group by 1`,
    ...params,
  );
};
