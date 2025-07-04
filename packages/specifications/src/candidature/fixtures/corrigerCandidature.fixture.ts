import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { AbstractFixture } from '../../fixture';

import { mapToDeprecatedValues } from './importerCandidature.fixture';

interface CorrigerCandidature {
  identifiantProjet: IdentifiantProjet.RawType;
  dépôtValue: Candidature.Dépôt.RawType;
  instructionValue: Candidature.Instruction.RawType;
  détailsValue: Record<string, string>;

  corrigéPar: string;
  corrigéLe: string;
}
export class CorrigerCandidatureFixture
  extends AbstractFixture<CorrigerCandidature>
  implements CorrigerCandidature
{
  #identifiantProjet!: IdentifiantProjet.RawType;
  get identifiantProjet(): IdentifiantProjet.RawType {
    return this.#identifiantProjet;
  }

  #dépôtValue!: CorrigerCandidature['dépôtValue'];
  get dépôtValue() {
    return this.#dépôtValue;
  }

  #instructionValue!: CorrigerCandidature['instructionValue'];
  get instructionValue() {
    return this.#instructionValue;
  }

  #corrigéPar: string = '';
  get corrigéPar() {
    return this.#corrigéPar;
  }
  #corrigéLe: string = '';
  get corrigéLe() {
    return this.#corrigéLe;
  }

  #détailsValue: Record<string, string> = {};
  get détailsValue() {
    return this.#détailsValue;
  }

  /**
   * @derecated kept for retro-compat, prefer dépôtValue & instructionValue
   */
  get values() {
    return mapToDeprecatedValues(this.dépôtValue, this.instructionValue);
  }

  créer(data: CorrigerCandidature): Readonly<CorrigerCandidature> {
    this.#identifiantProjet = data.identifiantProjet;
    this.#dépôtValue = data.dépôtValue;
    this.#instructionValue = data.instructionValue;
    this.#corrigéLe = data.corrigéLe;
    this.#corrigéPar = data.corrigéPar;

    this.aÉtéCréé = true;
    return this;
  }
}
