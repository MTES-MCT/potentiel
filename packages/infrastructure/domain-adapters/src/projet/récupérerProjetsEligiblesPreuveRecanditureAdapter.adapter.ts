import { DateTime } from '@potentiel-domain/common';
import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type ProjetPourRecandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.RawType;
  nom: string;
  dateDésignation: DateTime.RawType;
};

const selectProjetsEligiblesPreuveRecanditureQuery = `
  select json_build_object(
    'nom', cand.value->>'nomProjet',
    'identifiantProjet', cand.value->>'identifiantProjet',
    'email', cand.value->>'emailContact',
    'dateDésignation', cand.value->>'notification.notifiéeLe'
  ) as value
  from domain_views.projection cand 
  inner join domain_views.projection acces 
    on acces.key = format('accès|%s', cand.value->>'identifiantProjet')
  left join domain_views.projection recandidature 
    on recandidature.key like 'abandon|%' 
    and recandidature.value->>'demande.recandidature.preuve.identifiantProjet' = cand.value->>'identifiantProjet'
  left join domain_views.projection abandon 
    on abandon.key = format('abandon|%s', cand.value->>'identifiantProjet')
  where
    cand.key like 'candidature|%'
    and (cand.value->>'notification.notifiéeLe') > '2023-12-15T00:00:00.000Z'
    and (cand.value->>'notification.notifiéeLe') < '2025-03-30T00:00:00.000Z'
    and (abandon.key is null or abandon.value->>'estAbandonné' = 'false')
    and acces.value->'utilisateursAyantAccès' ? $1
    and recandidature.key is null
  order by cand.value->>'nomProjet';
`;

export const récupérerProjetsEligiblesPreuveRecanditureAdapter: Candidature.RécupérerProjetsEligiblesPreuveRecanditurePort =
  async (identifiantUtilisateur) => {
    const results = await executeSelect<{ value: ProjetPourRecandidatureReadModel }>(
      selectProjetsEligiblesPreuveRecanditureQuery,
      identifiantUtilisateur,
    );

    return results.map((result) => ({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(result.value.identifiantProjet),
      nom: result.value.nom,
      dateDésignation: DateTime.convertirEnValueType(result.value.dateDésignation),
    }));
  };
