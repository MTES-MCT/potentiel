import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { DateMiseEnServicePlusRécenteError, ImpossibleDeChangerLaDateDeFAError } from '../errors'
import { DonnéesDeRaccordementRenseignées } from '../events'
import { Project } from '../Project'

type Commande = {
  projetId: string
  dateMiseEnService?: Date
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
      commande.dateMiseEnService &&
      projet.dateMiseEnService &&
      projet.dateMiseEnService.getTime() < commande.dateMiseEnService.getTime()
    ) {
      return errAsync(new DateMiseEnServicePlusRécenteError())
    }

    return okAsync({ projet, commande })
  }

  const vérifierSiDateFAApplicableSansDateMeS = ({
    commande,
    projet,
  }: {
    commande: Commande
    projet: Project
  }) => {
    if (commande.dateFileAttente && !commande.dateMiseEnService) {
      if (projet.dateMiseEnService) {
        return errAsync(new ImpossibleDeChangerLaDateDeFAError())
      }
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
          dateMiseEnService: dateMiseEnService?.toISOString(),
          dateFileAttente: dateFileAttente?.toISOString(),
        },
      })
    )

  return (commande: Commande) =>
    chargerProjet(commande)
      .andThen(vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet)
      .andThen(vérifierSiDateFAApplicableSansDateMeS)
      .andThen(({ projet, commande }) =>
        commande.dateMiseEnService &&
        projet.dateMiseEnService?.getTime() === commande.dateMiseEnService?.getTime()
          ? okAsync(null)
          : enregistrerDonnéesDeRaccordement(commande)
      )
}
