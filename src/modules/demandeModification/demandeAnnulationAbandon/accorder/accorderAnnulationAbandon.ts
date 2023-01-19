import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync } from '@core/utils'
import { User } from '@entities'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre/queries'
import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'
import { Project } from '@modules/project'
import { StatutDemandeIncompatibleAvecAccordAnnulationAbandonError } from './StatutDemandeIncompatibleAvecAccordAnnulationAbandonError'

type Commande = { utilisateur: User; demandeId: string }

type Dépendances = {
  demandeAnnulationAbandonRepo: TransactionalRepository<DemandeAnnulationAbandon>
  publishToEventStore: EventStore['publish']
  getProjectAppelOffre: GetProjectAppelOffre
  projectRepo: Repository<Project>
}

export const makeAccorderAnnulationAbandon =
  ({
    demandeAnnulationAbandonRepo,
    publishToEventStore,
    getProjectAppelOffre,
    projectRepo,
  }: Dépendances) =>
  ({ utilisateur, demandeId }: Commande) =>
    demandeAnnulationAbandonRepo.transaction(new UniqueEntityID(demandeId), (demande) => {
      if (demande.statut !== 'envoyée') {
        return errAsync(new StatutDemandeIncompatibleAvecAccordAnnulationAbandonError(demandeId))
      }
      return okAsync(null)
    })
