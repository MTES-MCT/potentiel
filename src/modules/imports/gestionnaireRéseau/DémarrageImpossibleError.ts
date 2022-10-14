import { DémarrerImportGestionnaireRéseauCommande } from './démarrerImportGestionnaireRéseau'

export class DémarrageImpossibleError extends Error {
  constructor(public commande: DémarrerImportGestionnaireRéseauCommande) {
    super(
      `Un import gestionnaire de réseau est déjà en cours, vous devez attendre qu'il se termine avant d'en lancer un autre.`
    )
  }
}
