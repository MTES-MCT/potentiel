import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { DateMiseEnServicePlusRécenteError } from '../errors'
import { DateMiseEnServiceRenseignée } from '../events'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateMiseEnService: Date
}

type Dépendances = {
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}

export const makeRenseignerDateMiseEnService = ({
  publishToEventStore,
  projectRepo,
}: Dépendances) => {
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
