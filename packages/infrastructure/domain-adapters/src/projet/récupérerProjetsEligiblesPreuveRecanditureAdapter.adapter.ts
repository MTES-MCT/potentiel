import { Candidature } from '@potentiel-domain/projet';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

// MERCI DE NE PAS TOUCHER CETTE QUERY
const selectProjetsEligiblesPreuveRecanditureQuery = `
   select json_build_object(
    'nom', p."nomProjet",
    'appelOffre', p."appelOffreId",
    'période', p."periodeId",
    'famille', p."familleId",
    'numéroCRE', p."numeroCRE",
    'localité', json_build_object(
        'adresse', p."adresseProjet",
        'commune', p."communeProjet",
        'département', p."departementProjet",
        'région', p."regionProjet",
        'codePostal', p."codePostalProjet"
    ),
    'statut', case
        when p."notifiedOn" = 0 then 'non-notifié'
        when p."abandonedOn" <> 0 then 'abandonné'
        when p.classe = 'Classé' then 'classé'
        else 'éliminé'
    end,
    'nomReprésentantLégal', p."nomRepresentantLegal",
    'nomCandidat', p."nomCandidat",
    'email', p."email",
    'cahierDesCharges', p."cahierDesChargesActuel",
    'dateDésignation', to_char(to_timestamp(p."notifiedOn" / 1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'puissance', p."puissance"
  ) as value
  from "projects" p
  inner join "UserProjects" up on p.id = up."projectId"
  inner join "users" u on up."userId" = u.id
  left join domain_views.projection recandidature on 
    recandidature.key like 'abandon|%' 
    and recandidature.value->>'demande.recandidature.preuve.identifiantProjet' 
      = format('%s#%s#%s#%s',p."appelOffreId",p."periodeId",p."familleId",p."numeroCRE")
  where 
        p."notifiedOn" > 1702598400000 
    and p."notifiedOn"< 1743379200000 
    and p."abandonedOn" = 0 
    and u."email" = $1
    and recandidature.key is null
  order by "nomProjet"
`;

const selectPreuveRecandidature = `
  select value->>'preuveRecandidature'::text as "identifiantProjet" 
  from domain_views.projection where value->>'preuveRecandidature' = any ($1) group by value->>'preuveRecandidature'`;

export const récupérerProjetsEligiblesPreuveRecanditureAdapter: Candidature.RécupérerProjetsEligiblesPreuveRecanditurePort =
  async (identifiantUtilisateur) => {
    const results = await executeSelect<{ value: Candidature.ProjetEntity }>(
      selectProjetsEligiblesPreuveRecanditureQuery,
      identifiantUtilisateur,
    );

    const identifiantProjets = results.map(
      ({ value: { appelOffre, période, famille, numéroCRE } }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    );
    const preuves = await executeSelect<{ identifiantProjet: string }>(
      selectPreuveRecandidature,
      identifiantProjets,
    );

    return results
      .map((result) => result.value)
      .filter(
        ({ appelOffre, période, famille, numéroCRE }) =>
          !preuves
            .map((preuve) => preuve.identifiantProjet)
            .includes(`${appelOffre}#${période}#${famille}#${numéroCRE}`),
      );
  };
