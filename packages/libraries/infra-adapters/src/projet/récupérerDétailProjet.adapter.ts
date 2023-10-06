import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import {
  CandidatureLegacyReadModel,
  RécupérerCandidatureLegacyPort,
} from '@potentiel/domain-views';
import { isSome, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

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
        'région', "regionProjet"
    ),
    'statut', case
        when "notifiedOn" is null then 'non-notifié'
        when "abandonedOn" <> 0 then 'abandonné'
        when classe = 'Classé' then 'classé'
        else 'éliminé'
    end
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const récupérerCandidatureAdapter: RécupérerCandidatureLegacyPort = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}) => {
  const projets = await executeSelect<{
    value: Omit<CandidatureLegacyReadModel, 'type' | 'identifiantProjet'>;
  }>(selectProjectQuery, appelOffre, période, numéroCRE, isSome(famille) ? famille : '');

  if (!projets.length) {
    return none;
  }

  const projet = projets[0].value;

  return {
    ...projet,
    identifiantProjet: convertirEnIdentifiantProjet({
      appelOffre,
      période,
      famille,
      numéroCRE,
    }).formatter(),
    type: 'projet',
  };
};
