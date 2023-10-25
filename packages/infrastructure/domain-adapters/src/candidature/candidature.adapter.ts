import { CandidatureProjection, RécupérerCandidaturePort } from '@potentiel-domain/candidature';
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
