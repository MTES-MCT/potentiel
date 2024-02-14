import { IdentifiantProjet } from '@potentiel-domain/common';
import { isSome, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

export type CandidatureLegacyReadModel = {
  legacyId: string;
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  technologie: string;
  statut: string;
  nom: string;
  localité: {
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  potentielIdentifier: string;
  nomReprésentantLégal: string;
  nomCandidat: string;
  email: string;
  dateDésignation: string;
  puissance: number;
  cahierDesCharges: string;
};

const selectProjectQuery = `
  select json_build_object(
    'legacyId', "id",
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
    'potentielIdentifier', "potentielIdentifier",
    'nomReprésentantLégal', "nomRepresentantLegal",
    'nomCandidat', "nomCandidat",
    'email', "email",
    'cahierDesCharges', "cahierDesChargesActuel",
    'dateDésignation', to_char(to_timestamp("notifiedOn" / 1000)::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'puissance', "puissance",
    'technologie', case
                      when "technologie" is not null then "technologie"
                      else 'N/A'
                      end
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const récupérerCandidatureAdapter = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType) => {
  const projets = await executeSelect<{
    value: Omit<CandidatureLegacyReadModel, 'type' | 'identifiantProjet'>;
  }>(selectProjectQuery, appelOffre, période, numéroCRE, isSome(famille) ? famille : '');

  if (!projets.length) {
    return none;
  }

  const projet = projets[0].value;

  return {
    ...projet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ).formatter(),
    type: 'projet',
  };
};
