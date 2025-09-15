import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { mapToExemple, FieldToExempleMapper, mapDateTime } from '../../../../helpers/mapToExemple';
import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';

import { ModifierDépôtGarantiesFinancièresFixture } from './fixtures/modifier.fixture';
import {
  SoumettreDépôtGarantiesFinancièresFixture,
  SoumettreDépôtGarantiesFinancièresProps,
} from './fixtures/soumettre.fixture';
import { ValiderDépôtGarantiesFinancièresFixture } from './fixtures/valider.fixture';

export class DépôtGarantiesFinancièresWorld {
  readonly soumettre: SoumettreDépôtGarantiesFinancièresFixture;
  readonly modifier: ModifierDépôtGarantiesFinancièresFixture;
  readonly valider: ValiderDépôtGarantiesFinancièresFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.soumettre = new SoumettreDépôtGarantiesFinancièresFixture(this);
    this.modifier = new ModifierDépôtGarantiesFinancièresFixture(this);
    this.valider = new ValiderDépôtGarantiesFinancièresFixture(this);
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
    const dépôt: Partial<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel> =
      {
        ...this.soumettre.mapToExpected(),
        ...this.modifier.mapToExpected(),
        ...this.valider.mapToExpected(),
      };

    if (this.valider.aÉtéCréé && dépôt.attestation) {
      dépôt.attestation = DocumentProjet.bind({
        ...dépôt.attestation,
        typeDocument:
          Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
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
