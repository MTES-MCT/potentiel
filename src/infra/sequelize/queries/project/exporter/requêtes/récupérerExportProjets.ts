import models from '../../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../../helpers/mapToFindOptions'
import { GarantiesFinancières } from '../../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Colonne, isNotPropriétéDeLaColonneDétail, isPropriétéDeLaColonneDétail } from '../Colonne'
import { Literal } from 'sequelize/types/utils'
import { Project } from '../../../../projections/project/project.model'
import { Op } from 'sequelize'

const { Project: ProjectModel } = models

export const récupérerExportProjets = ({
  colonnesÀExporter,
  filtres,
  inclureLesProjetsNonNotifiés,
}: {
  colonnesÀExporter: Readonly<Array<Colonne>>
  filtres?: FiltreListeProjets
  inclureLesProjetsNonNotifiés?: true
}) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  return wrapInfra(
    ProjectModel.findAll({
      where: {
        ...findOptions?.where,
        notifiedOn: { [Op.gt]: 0 },
        ...(inclureLesProjetsNonNotifiés && { notifiedOn: { [Op.gte]: 0 } }),
      },
      include: [
        ...(findOptions ? findOptions.include : []),
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: [],
        },
      ],
      attributes: [...convertirEnAttributsSequelize(colonnesÀExporter), 'details'],
      raw: true,
    })
  ).map((projects) => ({
    colonnes: récupérerIntitulés(colonnesÀExporter),
    données: projects.map((project) => applatirEtChangerLesIntitulés(colonnesÀExporter, project)),
  }))
}

const applatirEtChangerLesIntitulés = (
  colonnesÀExporter: Readonly<Array<Colonne>>,
  { details, ...project }: Project
): { [key: string]: string | number } => ({
  ...colonnesÀExporter.filter(isNotPropriétéDeLaColonneDétail).reduce(
    (acc, c) => ({
      ...acc,
      [c.intitulé]:
        project[c.source === 'expression-sql' ? c.aliasColonne : c.nomColonneTableProjet],
    }),
    {}
  ),
  ...(details &&
    JSON.parse(
      JSON.stringify(
        details,
        colonnesÀExporter.filter(isPropriétéDeLaColonneDétail).map((c) => c.nomPropriété)
      )
    )),
})

const récupérerIntitulés = (colonnes: Readonly<Array<Colonne>>) =>
  colonnes.map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé))

const convertirEnAttributsSequelize = (
  colonnes: Readonly<Array<Colonne>>
): Array<[Literal, string] | string> =>
  colonnes
    .filter(isNotPropriétéDeLaColonneDétail)
    .map((c) =>
      c.source === 'expression-sql' ? [c.expressionSql, c.aliasColonne] : c.nomColonneTableProjet
    )
