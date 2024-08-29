import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type ProjetListéPourOREReadModel = {
  legacyId: string;
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

type Props = {
  limit?: number;
  offset?: number;
};

export const listerProjetForOreAdapter = async ({ limit, offset }: Props) => {
  const selectProjectQuery = format(`
  SELECT json_build_object(
    'legacyId', "id",
    'appelOffre', "appelOffreId",
    'période', "periodeId",
    'famille', "familleId",
    'numéroCRE', "numeroCRE",
    'localité', json_build_object(
        'commune', "communeProjet",
        'codePostal', "codePostalProjet"
    )
  ) as value
  FROM "projects"
  WHERE "classe" = 'Classé'
  AND "abandonedOn" <> '0'
  ${limit !== undefined ? `LIMIT ${limit}` : ''}
  ${offset !== undefined ? `OFFSET ${limit}` : ''}
`);

  const projets = await executeSelect<{
    value: Omit<ProjetListéPourOREReadModel, 'type' | 'identifiantProjet'>;
  }>(selectProjectQuery);

  const projectsWithIdentifiantProject = projets.map((projet) => {
    return {
      ...projet.value,
      identifiantProjet: IdentifiantProjet.convertirEnValueType(
        `${projet.value.appelOffre}#${projet.value.période}#${projet.value.famille}#${projet.value.numéroCRE}`,
      ).formatter(),
    };
  });

  return projectsWithIdentifiantProject;
};
