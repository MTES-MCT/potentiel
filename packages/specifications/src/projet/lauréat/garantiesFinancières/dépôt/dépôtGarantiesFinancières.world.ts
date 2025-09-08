import { DocumentProjet } from '@potentiel-domain/document';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
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
    const dépôt: Partial<
      Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel['dépôt']
    > = {
      ...this.soumettre.mapToExpected(),
      ...this.modifier.mapToExpected(),
      ...this.valider.mapToExpected(),
    };

    if (this.valider.aÉtéCréé && dépôt.attestation) {
      dépôt.attestation = DocumentProjet.bind({
        ...dépôt.attestation,
        typeDocument:
          GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
      });
    }

    return {
      identifiantProjet: this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet,
      dépôt: {
        ...dépôt,
        soumisLe: this.soumettre?.mapToExpected()?.soumisLe,
      },
    };
  }

  mapToAttestation() {
    if (this.modifier.aÉtéCréé) {
      return { content: this.modifier.content, format: this.modifier.attestation.format };
    }
    return { content: this.soumettre.content, format: this.soumettre.attestation.format };
  }
}
