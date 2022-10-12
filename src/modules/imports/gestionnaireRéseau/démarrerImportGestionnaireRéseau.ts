import { EventStore, TransactionalRepository } from '@core/domain'
import { ImportGestionnaireRéseau } from './ImportGestionnaireRéseau'
import { User } from '@entities'
import { ImportGestionnaireRéseauDémarré } from './events'

type MakeDémarrerImportGestionnaireRéseauDépendances = {
  importRepo: TransactionalRepository<ImportGestionnaireRéseau>
  publishToEventStore: EventStore['publish']
}

type DémarrerImportGestionnaireRéseauCommande = {
  utilisateur: User
  gestionnaire: string
}

export const makeDémarrerImportGestionnaireRéseau =
  ({ publishToEventStore }: MakeDémarrerImportGestionnaireRéseauDépendances) =>
  ({ utilisateur: { id: démarréPar }, gestionnaire }: DémarrerImportGestionnaireRéseauCommande) => {
    return publishToEventStore(
      new ImportGestionnaireRéseauDémarré({
        payload: {
          démarréPar,
          gestionnaire,
        },
      })
    )
  }
