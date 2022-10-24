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

export const makeRenseignerDateMiseEnService: MakeRenseignerDateMiseEnService = ({
  publishToEventStore,
  projectRepo,
}) => {
  const chargerProjet = (commande: Commande) =>
    projectRepo.load(new UniqueEntityID(commande.projetId)).map((projet) => ({
      commande,
      projet,
    }))

  const vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet = ({
    commande,
    projet,
  }: {
    commande: Commande
    projet: Project
  }) => {
    if (
      projet.dateMiseEnService &&
      projet.dateMiseEnService.getTime() < commande.dateMiseEnService.getTime()
    ) {
      return errAsync(new DateMiseEnServicePlusRécenteError())
    }

    return okAsync({ projet, commande })
  }

  const enregistrerDateMiseEnService = ({ projetId, dateMiseEnService }: Commande) =>
    publishToEventStore(
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
      .andThen(({ projet, commande }) =>
        projet.dateMiseEnService?.getTime() === commande.dateMiseEnService.getTime()
          ? okAsync(null)
          : enregistrerDateMiseEnService(commande)
      )
}
