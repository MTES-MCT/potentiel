import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { Project } from '@modules/project'
import { wrapInfra, errAsync, okAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import { ProjetNonAbandonnéError } from './ProjetNonAbandonnéError'
import { CDCIncompatibleAvecAnnulationAbandonError } from './CDCIncompatibleAvecAnnulationAbandonError'
import { AnnulationAbandonDemandée } from '../events'

type Commande = {
  user: User
  projetId: string
}

type Dépendances = {
  publishToEventStore: EventStore['publish']
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  projectRepo: Repository<Project>
}

export const makeDemanderAnnulationAbandon =
  ({ publishToEventStore, shouldUserAccessProject, projectRepo }: Dépendances) =>
  ({ user, projetId }: Commande) => {
    return wrapInfra(shouldUserAccessProject({ user, projectId: projetId }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }
        return okAsync(null)
      })
      .andThen(() => {
        return projectRepo.load(new UniqueEntityID(projetId))
      })
      .andThen((projet) => {
        if (projet.abandonedOn === 0) {
          return errAsync(new ProjetNonAbandonnéError(projet.id.toString()))
        }
        if (
          projet.cahierDesCharges.type === 'modifié' &&
          !projet.cahierDesCharges.annulationAbandonPossible
        ) {
          return errAsync(new CDCIncompatibleAvecAnnulationAbandonError(projet.id.toString()))
        }
        return publishToEventStore(
          new AnnulationAbandonDemandée({
            payload: {
              demandeId: new UniqueEntityID().toString(),
              projetId: projetId,
              demandéPar: user.id,
            },
          })
        )
      })
  }
