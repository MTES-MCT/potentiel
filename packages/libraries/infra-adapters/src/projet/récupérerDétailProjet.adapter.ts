import { ProjetReadModel, RécupérerDétailProjetPort } from '@potentiel/domain-views';
import { isSome, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const selectProjectWithoutFamilly = `
  SELECT
    nomProjet,
    nomCandidat,
    communeProjet,
    regionProjet,
    departementProjet,
    notifiedOn,
    abandonedOn,
    classe
  FROM ""
`;

const selectProject = `

`;

export const récupérerDétailProjetAdapter: RécupérerDétailProjetPort = async ({
  appelOffre,
  famille,
  numéroCRE,
  période,
}) => {
  const projects = await executeSelect<Omit<ProjetReadModel, 'type' | 'identifiantGestionnaire'>>(
    isSome(famille) ? selectProjectWithoutFamilly : selectProject,
    ...(isSome(famille)
      ? [appelOffre, famille, numéroCRE, période]
      : [appelOffre, numéroCRE, période]),
  );

  return none;
};
