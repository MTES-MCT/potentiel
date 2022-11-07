import { DémarrerImportDonnéesRaccordementCommande } from './démarrerImportDonnéesRaccordement'

export class DémarrageImpossibleError extends Error {
  constructor(public commande: DémarrerImportDonnéesRaccordementCommande) {
    super(
      `Un import de données de raccordement est déjà en cours, vous devez attendre qu'il se termine avant d'en lancer un autre.`
    )
  }
}
