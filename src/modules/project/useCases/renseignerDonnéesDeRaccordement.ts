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

    console.log('HERRRRREE OK')

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

    console.log('HERRRRREE2 OK')

    return okAsync({ projet, commande })
  }

  const enregistrerDonnéesDeRaccordement = (commande: Commande) => {
    console.log('IM GOING TO FIRE DonnéesDeRaccordementRenseignées', commande)

    if ('dateMiseEnService' in commande && 'dateFileAttente' in commande) {
      return publishToEventStore(
        new DonnéesDeRaccordementRenseignées({
          payload: {
            projetId: commande.projetId,
            dateMiseEnService: commande.dateMiseEnService,
            dateFileAttente: commande.dateFileAttente,
          },
        })
      )
    }
    if ('dateMiseEnService' in commande && !('dateFileAttente' in commande)) {
      return publishToEventStore(
        new DonnéesDeRaccordementRenseignées({
          payload: {
            projetId: commande.projetId,
            dateMiseEnService: commande.dateMiseEnService,
          },
        })
      )
    }
    if (!('dateMiseEnService' in commande) && 'dateFileAttente' in commande) {
      return publishToEventStore(
        new DonnéesDeRaccordementRenseignées({
          payload: {
            projetId: commande.projetId,
            dateFileAttente: commande.dateFileAttente,
          },
        })
      )
    }
    return okAsync(null)
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
