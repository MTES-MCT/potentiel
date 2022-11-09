import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { DateMiseEnServicePlusRécenteError } from '../errors'
import { DonnéesDeRaccordementRenseignées } from '../events'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateMiseEnService: Date
  dateFileAttente?: Date
}

type Dépendances = {
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}

export type RenseignerDonnéesDeRaccordement = ReturnType<typeof makeRenseignerDonnéesDeRaccordement>

export const makeRenseignerDonnéesDeRaccordement = ({
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

  const enregistrerDonnéesDeRaccordement = ({
    projetId,
    dateMiseEnService,
    dateFileAttente,
  }: Commande) =>
    publishToEventStore(
      new DonnéesDeRaccordementRenseignées({
        payload: {
          projetId,
          dateMiseEnService: dateMiseEnService.toISOString(),
          dateFileAttente: dateFileAttente?.toISOString(),
        },
      })
    )

  return (commande) =>
    chargerProjet(commande)
      .andThen(vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet)
      .andThen(({ projet, commande }) =>
        projet.dateMiseEnService?.getTime() === commande.dateMiseEnService.getTime()
          ? okAsync(null)
          : enregistrerDonnéesDeRaccordement(commande)
      )
}
