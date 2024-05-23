import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

export type OREProjectsReadModel = {
  id: string;
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  localité: {
    commune: string;
    codePostal: string;
  };
};

const selectProjectQuery = `
  SELECT json_build_object(
    'id', "id",
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'numéroCRE', "numeroCRE",
    'localité', json_build_object(
        'commune', "communeProjet",
        'codePostal', "codePostalProjet"
    )
  )
  FROM "projects"
  where "classe" = 'Classé'
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
      `${projet.value.appelOffre}#${projet.value.période}#${projet.value.famille}#${projet.value.numéroCRE}`,
    ).formatter(),
  }));
};
