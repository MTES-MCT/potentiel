import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import { userIsNot } from '@modules/users'
import { DateDeMiseEnServiceAjoutée } from '../events'
import { Project } from '../Project'

type AjouterDateDeMiseEnService = (commande: {
  nouvelleDateDeMiseEnService: Date
  utilisateur: User
  projetId: string
}) => ResultAsync<null, UnauthorizedError | InfraNotAvailableError>

type MakeAjouterDateDeMiseEnService = (dépendances: {
  projectRepo: Repository<Project>
  publishToEventStore: EventStore['publish']
}) => AjouterDateDeMiseEnService

export const makeAjouterDateDeMiseEnService: MakeAjouterDateDeMiseEnService =
  ({ projectRepo, publishToEventStore }) =>
  ({ nouvelleDateDeMiseEnService, utilisateur, projetId }) => {
    if (userIsNot(['admin', 'dgec-validateur'])(utilisateur)) {
      return errAsync(new UnauthorizedError())
    }

    return projectRepo.load(new UniqueEntityID(projetId)).andThen((projet) => {
      if (projet.dateDeMiseEnService === nouvelleDateDeMiseEnService) {
        return okAsync(null)
      }

      return publishToEventStore(
        new DateDeMiseEnServiceAjoutée({
          payload: {
            utilisateurId: utilisateur.id,
            projetId,
            nouvelleDateDeMiseEnService: nouvelleDateDeMiseEnService.toISOString(),
          },
        })
      ).andThen(() => okAsync(null))
    })
  }
