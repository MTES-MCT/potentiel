import { DémarrerImportDonnéesRaccordementCommande } from './démarrerImportDonnéesRaccordement'

export class DonnéesDeMiseAJourObligatoiresError extends Error {
  constructor(public commande: DémarrerImportDonnéesRaccordementCommande) {
    super(`Les données de mise à jour sont obligatoires pour pouvoir démarrer l'import`)
  }
}
