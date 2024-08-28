import format from 'pg-format';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { RangeOptions } from '@potentiel-domain/entity';

// MERCI DE NE PAS TOUCHER CETTE QUERY
const selectProjetQuery = `
  select json_build_object(
    'nom', "nomProjet",
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'numéroCRE', "numeroCRE",
    'localité', json_build_object(
        'adresse', "adresseProjet",
        'commune', "communeProjet",
        'département', "departementProjet",
        'région', "regionProjet",
        'codePostal', "codePostalProjet"
    ),
    'statut', case
        when "notifiedOn" is null then 'non-notifié'
        when "abandonedOn" <> 0 then 'abandonné'
        when classe = 'Classé' then 'classé'
        else 'éliminé'
    end,
    'nomReprésentantLégal', "nomRepresentantLegal",
    'nomCandidat', "nomCandidat",
    'email', "email",
    'cahierDesCharges', "cahierDesChargesActuel",
    'dateDésignation', to_char(to_timestamp("notifiedOn" / 1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'puissance', "puissance",
    'adressePostaleCandidat', "details"->>'Adresse postale du contact'
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const récupérerProjetAdapter: Candidature.RécupérerProjetPort = async (identifiant) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiant);
  const result = await executeSelect<{ value: Candidature.ProjetEntity }>(
    selectProjetQuery,
    appelOffre,
    période,
    numéroCRE,
    famille,
  );

  if (!result.length) {
    return Option.none;
  }

  return result[0].value;
};

const selectProjetsQuerySelect = `
  json_build_object(
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
`;

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
  where p."notifiedOn" > 1702598400000 and p."abandonedOn" = 0 and u."email" = $1
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

const buildQueryByRole = (role: Role.RawType, query: string) => {
  switch (role) {
    case 'cre':
    case 'admin':
    case 'dgec-validateur':
      return ['select', query, 'from projects p', 'where (1=1)'].join('\n');
    case 'acheteur-obligé':
    case 'caisse-des-dépôts':
      return ['select', query, 'from projects p', 'where "notifiedOn">0'].join('\n');
    case 'porteur-projet':
      return [
        'select',
        query,
        'from projects p',
        `inner join "UserProjects" up on p.id = up."projectId"`,
        `inner join "users" u on up."userId" = u.id`,
        `where u."email" = %1$L AND "notifiedOn">0`,
      ].join('\n');
    case 'dreal':
      return [
        'select',
        query,
        'from projects p',
        `inner join "UserDreal" ud on ud.dreal=up."regionProjet"`,
        `inner join "users" u on ud."userId" = u.id`,
        `where u."email" = %1$L AND "notifiedOn">0`,
      ].join('\n');
    default:
      throw new Error('not implemented');
  }
};

const addPagination = (sqlQuery: string, range: RangeOptions) => {
  return [
    sqlQuery,
    `order by p."nomProjet"`,
    `LIMIT ${+range.endPosition - range.startPosition + 1}`,
    `OFFSET ${+range.startPosition}`,
  ].join('\n');
};

const addSearch = (sqlQuery: string, search: string | undefined) => {
  if (!search) return sqlQuery;
  return [
    sqlQuery,
    `AND  p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" = %2$L`,
  ].join('\n');
};

export const récupérerProjetsAdapter: Candidature.RécupérerProjetsPort = async (
  identifiantUtilisateur,
  role,
  range,
  search,
) => {
  const values = [identifiantUtilisateur, search];

  const results = await executeSelect<{ value: Candidature.ProjetEntity }>(
    format(
      addPagination(addSearch(buildQueryByRole(role, selectProjetsQuerySelect), search), range),
      ...values,
    ),
  );
  const [{ total }] = await executeSelect<{ total: number }>(
    format(addSearch(buildQueryByRole(role, 'count(*) as total'), search), ...values),
  );

  return { items: results.map((result) => result.value), total };
};
