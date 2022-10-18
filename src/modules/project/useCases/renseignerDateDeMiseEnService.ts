import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import { DateDeMiseEnServicePlusRécenteError } from '../errors'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateMiseEnService: Date
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

  const vérifierSiDateDeMiseEnServicePlusAncienne = (résultat: {
    commande: Commande
    projet: Project
  }) => {
    const { commande, projet } = résultat

    if (
      projet.dateMiseEnService &&
      projet.dateMiseEnService.getTime() > commande.dateMiseEnService.getTime()
    ) {
      return errAsync(new DateDeMiseEnServicePlusRécenteError())
    }

    return okAsync(null)
  }

  return (commande) =>
    chargerProjet(commande).andThen((projet) => vérifierSiDateDeMiseEnServicePlusAncienne(projet))
}
