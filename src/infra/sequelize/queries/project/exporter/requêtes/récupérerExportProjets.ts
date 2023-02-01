import models from '../../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../../helpers/mapToFindOptions'
import { GarantiesFinancières } from '../../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import {
  Colonne,
  mapperVersAttributs,
  récupérerColonnesDétails,
  récupérerColonnesNonDétails,
  récupérerIntitulés,
} from '../Colonne'

const { Project: ProjectModel } = models

export const récupérerExportProjets = ({
  colonnesÀExporter,
  filtres,
}: {
  colonnesÀExporter: Readonly<Array<Colonne>>
  filtres?: FiltreListeProjets
}) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  return wrapInfra(
    ProjectModel.findAll({
      where: findOptions?.where,
      include: [
        ...(findOptions ? findOptions.include : []),
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: [],
        },
      ],
      attributes: [...mapperVersAttributs(colonnesÀExporter), 'details'],
      raw: true,
    })
  ).map((projects) => ({
    colonnes: récupérerIntitulés(colonnesÀExporter),
    données: projects.map(({ details, ...project }) => ({
      ...récupérerColonnesNonDétails(colonnesÀExporter).reduce((acc, c) => {
        return {
          ...acc,
          [c.intitulé]: project[c.literal ? c.alias : c.champ],
        }
      }, {}),
      ...(details &&
        JSON.parse(JSON.stringify(details, récupérerColonnesDétails(colonnesÀExporter)))),
    })),
  }))
}
