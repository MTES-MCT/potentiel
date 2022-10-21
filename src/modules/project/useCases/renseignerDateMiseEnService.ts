import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import { DateMiseEnServicePlusRécenteError } from '../errors'
import { DateMiseEnServiceRenseignée } from '../events'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateMiseEnService: Date
}

type RenseignerDateMiseEnService = (commande: Commande) => ResultAsync<null, UnauthorizedError>

type MakeRenseignerDateMiseEnService = (dépendances: {
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}) => RenseignerDateMiseEnService

type Résultat = {
  commande: Commande
  projet: Project
}

export const makeRenseignerDateMiseEnService: MakeRenseignerDateMiseEnService = ({
  publishToEventStore,
  projectRepo,
}) => {
  const chargerProjet = (commande: Commande) =>
    projectRepo.load(new UniqueEntityID(commande.projetId)).map((projet) => ({
      commande,
      projet,
    }))

  const vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet = (résultat: Résultat) => {
    const { commande, projet } = résultat

    if (
      projet.dateMiseEnService &&
      projet.dateMiseEnService.getTime() < commande.dateMiseEnService.getTime()
    ) {
      return errAsync(new DateMiseEnServicePlusRécenteError())
    }

    return okAsync({ projet, commande })
  }

  const enregistrerDateMiseEnService = ({
    projet,
    commande: { projetId, dateMiseEnService },
  }: Résultat) =>
    projet.dateMiseEnService?.getTime() === dateMiseEnService.getTime()
      ? okAsync(null)
      : publishToEventStore(
          new DateMiseEnServiceRenseignée({
            payload: {
              projetId,
              dateMiseEnService: dateMiseEnService.toISOString(),
            },
          })
        )

  return (commande) =>
    chargerProjet(commande)
      .andThen(vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet)
      .andThen(enregistrerDateMiseEnService)
}
