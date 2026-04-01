import { Lauréat } from '@potentiel-domain/projet';

import {
  mapToExemple,
  FieldToExempleMapper,
  mapDateTime,
  mapBoolean,
} from '../../../../helpers/mapToExemple.js';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world.js';

import {
  ModifierDépôtGarantiesFinancièresFixture,
  ModifierDépôtGarantiesFinancièresProps,
} from './fixtures/modifierDépôt.fixture.js';
import { ValiderDépôtGarantiesFinancièresFixture } from './fixtures/validerDépôt.fixture.js';
import {
  SoumettreDépôtGarantiesFinancièresFixture,
  SoumettreDépôtGarantiesFinancièresProps,
} from './fixtures/soumettreDépôt.fixture.js';

export class DépôtGarantiesFinancièresWorld {
  readonly soumettre: SoumettreDépôtGarantiesFinancièresFixture;
  readonly modifier: ModifierDépôtGarantiesFinancièresFixture;
  readonly valider: ValiderDépôtGarantiesFinancièresFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.soumettre = new SoumettreDépôtGarantiesFinancièresFixture(this);
    this.modifier = new ModifierDépôtGarantiesFinancièresFixture(this);
    this.valider = new ValiderDépôtGarantiesFinancièresFixture(this);
  }

  mapExempleToUseCaseData(exemple: Record<string, string>) {
    const dépôtMap: FieldToExempleMapper<
      SoumettreDépôtGarantiesFinancièresProps & ModifierDépôtGarantiesFinancièresProps
    > = {
      type: ['type GF'],
      dateConstitution: ['date de constitution', mapDateTime],
      dateÉchéance: ["date d'échéance", mapDateTime],
      estUnNouveauDocument: ['Le document a été modifié ?', mapBoolean],
    };
    return mapToExemple(exemple, dépôtMap);
  }

  mapToExpected() {
    const dépôt: Partial<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel> =
      {
        ...this.soumettre.mapToExpected(),
        ...this.modifier.mapToExpected(),
        ...this.valider.mapToExpected(),
      };

    if (this.valider.aÉtéCréé && dépôt.document) {
      const { identifiantProjet, dateCréation, format } = dépôt.document;

      dépôt.document =
        Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle({
          identifiantProjet,
          dateConstitution: dateCréation,
          attestation: {
            format,
          },
        });
    }

    return {
      identifiantProjet: this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet,
      ...dépôt,
      soumisLe: this.soumettre?.mapToExpected()?.soumisLe,
    };
  }

  mapToAttestation() {
    if (this.modifier.aÉtéCréé) {
      return this.modifier.attestation;
    }
    return this.soumettre.attestation;
  }
}
