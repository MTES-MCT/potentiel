import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import { DateDeMiseEnServicePlusRécenteError } from '../errors'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateDeMiseEnService: Date
}

type RenseignerDateDeMiseEnService = (commande: Commande) => ResultAsync<null, UnauthorizedError>

type MakeRenseignerDateDeMiseEnService = (dépendances: {
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}) => RenseignerDateDeMiseEnService

export const makeRenseignerDateDeMiseEnService: MakeRenseignerDateDeMiseEnService = ({
  projectRepo,
}) => {
  const chargerProjet = (commande: Commande) =>
    projectRepo.load(new UniqueEntityID(commande.projetId)).map((projet) => ({
      commande,
      projet,
    }))

  const vérifierSiDateDeMiseEnServicePlusAncienneQueCelleDuProjet = (résultat: {
    commande: Commande
    projet: Project
  }) => {
    const { commande, projet } = résultat

    if (
      projet.dateDeMiseEnService &&
      projet.dateDeMiseEnService.getTime() < commande.dateDeMiseEnService.getTime()
    ) {
      return errAsync(new DateDeMiseEnServicePlusRécenteError())
    }

    return okAsync(commande)
  }

  const enregistrerDateDeMiseEnService = (commande: Commande) => {
    console.log('I have to maj', commande)
    return okAsync(null)
  }

  return (commande) =>
    chargerProjet(commande)
      .andThen(vérifierSiDateDeMiseEnServicePlusAncienneQueCelleDuProjet)
      .andThen(enregistrerDateDeMiseEnService)
}
