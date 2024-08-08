import { IdentifiantProjet } from '@potentiel-domain/common';

type CandidatureFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export class CandidatureWorld {
  #candidatureFixtures: Map<string, CandidatureFixture> = new Map();
  get candidatureFixtures() {
    return this.#candidatureFixtures;
  }
  rechercherCandidatureFixture(nom: string) {
    const candidature = this.#candidatureFixtures.get(nom);

    if (!candidature) {
      throw new Error(`Aucune candidature correspondant à ${nom} dans les jeux de données`);
    }

    return candidature;
  }
}
