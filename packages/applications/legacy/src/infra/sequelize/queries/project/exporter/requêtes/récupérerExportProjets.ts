import { wrapInfra } from '../../../../../../core/utils';
import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import { mapToFindOptions } from '../../helpers/mapToFindOptions';
import { Colonne, isNotPropriétéDeLaColonneDétail, isPropriétéDeLaColonneDétail } from '../Colonne';
import { Literal } from 'sequelize/types/utils';
import { Project, UserProjects } from '../../../../projectionsNext';
import { Op } from 'sequelize';

type RécupérerExportProjetsProps = {
  colonnesÀExporter: Readonly<Array<Colonne>>;
  filtres?: FiltreListeProjets;
  seulementLesProjetsAvecAccèsPour?: string;
  seulementLesProjetsParRégion?: string;
};

export const récupérerExportProjets = ({
  colonnesÀExporter,
  filtres,
  seulementLesProjetsAvecAccèsPour,
  seulementLesProjetsParRégion,
}: RécupérerExportProjetsProps) => {
  const findOptions = mapToFindOptions(filtres);

  const appelOffreIdPetitPVBâtimentPPE2 = 'PPE2 - Petit PV Bâtiment';

  return wrapInfra(
    Project.findAll({
      where: {
        appelOffreId: { [Op.ne]: appelOffreIdPetitPVBâtimentPPE2 },
        ...findOptions?.where,
        notifiedOn: { [Op.gt]: 0 },
        ...(seulementLesProjetsAvecAccèsPour && {
          '$users.userId$': seulementLesProjetsAvecAccèsPour,
        }),
        ...(seulementLesProjetsParRégion && {
          regionProjet: { [Op.substring]: seulementLesProjetsParRégion },
        }),
      },
      include: [
        ...(seulementLesProjetsAvecAccèsPour
          ? [
              {
                model: UserProjects,
                as: 'users',
                attributes: [],
              },
            ]
          : []),
      ],
      attributes: [...convertirEnAttributsSequelize(colonnesÀExporter), 'details'],
      raw: true,
    }),
  ).map((projects) => ({
    colonnes: récupérerIntitulés(colonnesÀExporter),
    données: projects.map((project) =>
      applatirEtChangerLesIntitulés({ colonnesÀExporter, project }),
    ),
  }));
};

type ApplatirEtChangerLesIntitulés = (args: {
  colonnesÀExporter: Readonly<Array<Colonne>>;
  project: Project;
}) => { [key: string]: string | number };

const applatirEtChangerLesIntitulés: ApplatirEtChangerLesIntitulés = ({
  colonnesÀExporter,
  project: { details, ...project },
}) => ({
  ...colonnesÀExporter.filter(isNotPropriétéDeLaColonneDétail).reduce(
    (acc, c) => ({
      ...acc,
      [c.intitulé]:
        project[c.source === 'expression-sql' ? c.aliasColonne : c.nomColonneTableProjet],
    }),
    {},
  ),
  ...(details &&
    JSON.parse(
      JSON.stringify(
        details,
        colonnesÀExporter.filter(isPropriétéDeLaColonneDétail).map((c) => c.nomPropriété),
      ),
    )),
});

const récupérerIntitulés = (colonnes: Readonly<Array<Colonne>>) =>
  colonnes.map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé));

const convertirEnAttributsSequelize = (
  colonnes: Readonly<Array<Colonne>>,
): Array<[Literal, string] | string> =>
  colonnes
    .filter(isNotPropriétéDeLaColonneDétail)
    .map((c) =>
      c.source === 'expression-sql' ? [c.expressionSql, c.aliasColonne] : c.nomColonneTableProjet,
    );
