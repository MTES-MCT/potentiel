import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

export type OREProjectsReadModel = {
  id: string;
  identifiantProjet: string;
  appelOffreId: string;
  période: string;
  famille: string;
  statut: string;
  nom: string;
  localité: {
    commune: string;
    codePostal: string;
  };
  numéroCRE: string;
  potentielIdentifier: string;
};

const selectProjectQuery = `
  select json_build_object(
    'id', "id",
    'nom', "nom",
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'localité', json_build_object(
        'commune', "communeProjet",
        'codePostal', "codePostalProjet"
    ),
    'numéroCRE', "numeroCRE",
    'statut', case
        when "notifiedOn" is null then 'non-notifié'
        when "abandonedOn" <> 0 then 'abandonné'
        when classe = 'Classé' then 'classé'
        else 'éliminé'
    end,
    'potentielIdentifier', "potentielIdentifier",
  from "projects"
`;

export const listerProjetForOreAdapter = async () => {
  const projets = await executeSelect<{
    value: Omit<OREProjectsReadModel, 'type' | 'identifiantProjet'>;
  }>(selectProjectQuery);

  if (!projets.length) {
    return Option.none;
  }

  return projets.map((projet) => ({
    ...projet,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      `${projet.value.appelOffreId}#${projet.value.période}#${projet.value.famille}#${projet.value.numéroCRE}`,
    ).formatter(),
    type: 'projet',
  }));
};
