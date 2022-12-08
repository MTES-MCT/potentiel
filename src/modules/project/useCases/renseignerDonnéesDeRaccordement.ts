import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { DonnéesRaccordement } from '@modules/imports/donnéesRaccordement'
import { DateMiseEnServicePlusRécenteError, ImpossibleDeChangerLaDateDeFAError } from '../errors'
import { DonnéesDeRaccordementRenseignées } from '../events'
import { Project } from '../Project'

type Commande = {
  projetId: string
} & DonnéesRaccordement

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
      'dateMiseEnService' in commande &&
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
    if ('dateFileAttente' in commande && !('dateMiseEnService' in commande)) {
      if (projet.dateMiseEnService) {
        return errAsync(new ImpossibleDeChangerLaDateDeFAError())
      }
    }

    return okAsync({ projet, commande })
  }

  const enregistrerDonnéesDeRaccordement = (commande: Commande) => {
    if (!('dateFileAttente' in commande) && !('dateMiseEnService' in commande)) {
      return okAsync(null)
    }

    return publishToEventStore(
      new DonnéesDeRaccordementRenseignées({
        // @ts-ignore
        payload: {
          projetId: commande.projetId,
          ...('dateMiseEnService' in commande && {
            dateMiseEnService: commande.dateMiseEnService,
          }),
          ...('dateFileAttente' in commande && { dateFileAttente: commande.dateFileAttente }),
        },
      })
    )
  }

  return (commande: Commande) =>
    chargerProjet(commande)
      .andThen(vérifierSiDateMiseEnServicePlusAncienneQueCelleDuProjet)
      .andThen(vérifierSiDateFAApplicableSansDateMeS)
      .andThen(({ projet, commande }) => {
        if (
          'dateMiseEnService' in commande &&
          projet.dateMiseEnService?.getTime() === commande.dateMiseEnService?.getTime()
        ) {
          return okAsync(null)
        }

        if (
          !('dateMiseEnService' in commande) &&
          'dateFileAttente' in commande &&
          projet.dateFileAttente?.getTime() === commande.dateFileAttente?.getTime()
        ) {
          return okAsync(null)
        }

        return enregistrerDonnéesDeRaccordement(commande)
      })
}
