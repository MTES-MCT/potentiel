import { Project } from '../../../../projectionsNext';

const attributes: (keyof Project)[] = [
  'id',
  'appelOffreId',
  'periodeId',
  'familleId',
  'nomProjet',
  'potentielIdentifier',
  'adresseProjet',
  'codePostalProjet',
  'communeProjet',
  'numeroCRE',
];

type Attribute = (typeof attributes)[number];

type PartialProject = Pick<Project, Attribute>;

export const listerProjetsForGRDScript = async (): Promise<PartialProject[]> => {
  const résultat = await Project.findAndCountAll({
    attributes,
  });

  return résultat.rows;
};
