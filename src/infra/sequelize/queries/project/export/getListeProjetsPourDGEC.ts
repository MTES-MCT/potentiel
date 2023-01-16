import models from '../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../lister/requêtes/mapToFindOptions'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { Colonne } from './donnéesProjetParCatégorie'

const { Project: ProjectModel } = models

export const getProjetsListePourDGEC = ({
  listeColonnes,
  filtres,
}: {
  listeColonnes: Colonne[]
  filtres?: FiltreListeProjets
}) => {
  const attributes = listeColonnes.map((c) => [c.champ, c.intitulé])
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
      //@ts-ignore
      attributes,
      raw: true,
    })
  )
}
