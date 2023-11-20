import {
  CandidatureProjection,
  RécupérerCandidaturePort,
  RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort,
} from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

// MERCI DE NE PAS TOUCHER CETTE QUERY
const selectCandidatureQuery = `
  select json_build_object(
    'nom', "nomProjet",
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'numéroCRE', "numeroCRE",
    'localité', json_build_object(
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
    'puissance', "puissance"
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const récupérerCandidatureAdapter: RécupérerCandidaturePort = async (identifiant) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiant);
  const result = await executeSelect<{ value: CandidatureProjection }>(
    selectCandidatureQuery,
    appelOffre,
    période,
    numéroCRE,
    famille,
  );

  if (!result.length) {
    return none;
  }

  return result[0].value;
};

// MERCI DE NE PAS TOUCHER CETTE QUERY
const selectCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery = `
   select json_build_object(
    'nom', p."nomProjet",
    'appelOffre', p."appelOffreId",
    'période', p."periodeId",
    'famille', p."familleId",
    'numéroCRE', p."numeroCRE",
    'localité', json_build_object(
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
  where p."notifiedOn" > 0 and u."email" = $1
  order by "nomProjet"
`;

export const récupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurAdapter: RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort =
  async (identifiantUtilisateur) => {
    const { appelOffre, famille, numéroCRE, période } =
      IdentifiantProjet.convertirEnValueType(identifiantUtilisateur);

    const results = await executeSelect<{ value: CandidatureProjection }>(
      selectCandidatureQuery,
      appelOffre,
      période,
      numéroCRE,
      famille,
    );

    return results.map((result) => result.value);
  };
