import { DémarrerImportGestionnaireRéseauCommande } from './démarrerImportGestionnaireRéseau'

export class DonnéesDeMiseAJourObligatoiresError extends Error {
  constructor(public commande: DémarrerImportGestionnaireRéseauCommande) {
    super(`Les données de mise à jour sont obligatoires pour pouvoir démarrer l'import`)
  }
}
