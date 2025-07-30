import { mapToExemple, FieldToExempleMapper, mapDateTime } from '../../../../helpers/mapToExemple';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';

import {
  SoumettreDépôtGarantiesFinancièresFixture,
  SoumettreDépôtGarantiesFinancièresProps,
} from './fixtures/soumettre.fixture';
import { ValiderDépôtGarantiesFinancièresFixture } from './fixtures/valider.fixture';

export class DépôtGarantiesFinancièresWorld {
  readonly soumettre: SoumettreDépôtGarantiesFinancièresFixture;
  readonly valider: ValiderDépôtGarantiesFinancièresFixture;
  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.soumettre = new SoumettreDépôtGarantiesFinancièresFixture(this);
    this.valider = new ValiderDépôtGarantiesFinancièresFixture();
  }

  mapExempleToUseCaseData(
    exemple: Record<string, string>,
  ): SoumettreDépôtGarantiesFinancièresProps {
    const dépôtMap: FieldToExempleMapper<SoumettreDépôtGarantiesFinancièresProps> = {
      type: ['type GF'],
      dateConstitution: ['date de constitution', mapDateTime],
      dateÉchéance: ["date d'échéance", mapDateTime],
      // TODO inutile, à supprimer une fois tous les tests GF passés en fixtures
      soumisLe: ['date de soumission', mapDateTime],
    };
    return mapToExemple(exemple, dépôtMap);
  }

  mapToExpected() {
    return {
      identifiantProjet: this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet,
      garantiesFinancières: {
        ...this.soumettre.mapToExpected(),
        ...this.valider.mapToExpected(),
      },
    };
  }

  mapToAttestation() {
    return { content: this.soumettre.content, format: this.soumettre.attestation.format };
  }
}
