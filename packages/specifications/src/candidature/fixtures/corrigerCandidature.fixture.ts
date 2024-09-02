import { AbstractFixture } from '../../fixture';

interface CorrigerCandidature {
  corrigéLe: string;
  corrigéPar: string;
}
export class CorrigerCandidatureFixture
  extends AbstractFixture<CorrigerCandidature>
  implements CorrigerCandidature
{
  #corrigéLe!: string;
  get corrigéLe() {
    return this.#corrigéLe;
  }
  #corrigéPar!: string;
  get corrigéPar() {
    return this.#corrigéPar;
  }

  créer(data: CorrigerCandidature): Readonly<CorrigerCandidature> {
    this.#corrigéLe = data.corrigéLe;
    this.#corrigéPar = data.corrigéPar;
    this.aÉtéCréé = true;
    return {
      corrigéLe: this.corrigéLe,
      corrigéPar: this.corrigéPar,
    };
  }
}
