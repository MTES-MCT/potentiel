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
  return wrapInfra(
    ProjectModel.findAll({
      ...(filtres && mapToFindOptions(filtres)),
      include: [
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: ['dateEnvoi', 'dateConstitution'],
        },
      ],
      //@ts-ignore
      attributes: listeColonnes.map((c) => [c.champ, c.intitulé]),
    })
  )
}
