import { DateTime } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

type ProjetPourRecandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.RawType;
  nom: string;
  dateDésignation: DateTime.RawType;
};

const selectProjetsEligiblesPreuveRecanditureQuery = `
   select json_build_object(
    'nom', p."nomProjet",
    'identifiantProjet', format('%s#%s#%s#%s', p."appelOffreId",p."periodeId",p."familleId",p."numeroCRE"),
    'email', p."email",
    'dateDésignation', to_char(to_timestamp(p."notifiedOn" / 1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  ) as value
  from "projects" p
  inner join domain_views.projection acc on acc.key=format('accès|%s#%s#%s#%s', p."appelOffreId",p."periodeId",p."familleId",p."numeroCRE")
  left join domain_views.projection recandidature on 
    recandidature.key like 'abandon|%' 
    and recandidature.value->>'demande.recandidature.preuve.identifiantProjet' 
      = format('%s#%s#%s#%s',p."appelOffreId",p."periodeId",p."familleId",p."numeroCRE")
  where 
        p."notifiedOn" > 1702598400000 
    and p."notifiedOn"< 1743379200000 
    and p."abandonedOn" = 0 
    and acc.value->'utilisateursAyantAccès' ? $1
    and recandidature.key is null
  order by "nomProjet"
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
