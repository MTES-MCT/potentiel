import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { AbstractFixture } from '../../fixture.js';

interface CorrigerCandidature {
  dépôtValue: Candidature.Dépôt.RawType;
  instructionValue: Candidature.Instruction.RawType;
  détailsValue: Record<string, string> | undefined;

  corrigéPar: string;
  corrigéLe: string;
}

type CréerCorrigerCandidatureFixtureProps = Omit<CorrigerCandidature, 'identifiantProjet'> & {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

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

  #détailsValue: Record<string, string> | undefined = undefined;
  get détailsValue() {
    return this.#détailsValue;
  }

  créer(data: CréerCorrigerCandidatureFixtureProps): Readonly<CorrigerCandidatureFixture> {
    this.#identifiantProjet = IdentifiantProjet.bind(data.identifiantProjet).formatter();
    this.#dépôtValue = data.dépôtValue;
    this.#instructionValue = data.instructionValue;
    this.#corrigéLe = data.corrigéLe;
    this.#corrigéPar = data.corrigéPar;
    this.#détailsValue = data.détailsValue;

    this.aÉtéCréé = true;
    return this;
  }
}
