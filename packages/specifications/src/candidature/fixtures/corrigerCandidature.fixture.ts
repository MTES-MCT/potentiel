import { Candidature } from '@potentiel-domain/candidature';

import { AbstractFixture } from '../../fixture';

interface CorrigerCandidature {
  identifiantProjet: string;
  values: Candidature.CorrigerCandidatureUseCase['data'];
}
export class CorrigerCandidatureFixture
  extends AbstractFixture<CorrigerCandidature>
  implements CorrigerCandidature
{
  #identifiantProjet!: string;
  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #values!: Candidature.CorrigerCandidatureUseCase['data'];
  get values() {
    return this.#values;
  }

  créer(data: CorrigerCandidature): Readonly<CorrigerCandidature> {
    this.#identifiantProjet = data.identifiantProjet;
    this.#values = data.values;
    this.aÉtéCréé = true;
    return {
      identifiantProjet: this.identifiantProjet,
      values: this.values,
    };
  }
}
