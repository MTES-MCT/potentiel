import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';
import { FieldToExempleMapper, mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple';

import {
  EnregistrerGarantiesFinancièresFixture,
  EnregistrerGarantiesFinancièresProps,
} from './fixtures/enregistrerGarantiesFinancières.fixture';
import { ModifierGarantiesFinancièresFixture } from './fixtures/modifierGarantiesFinancières.fixture';
import { EnregistrerAttestationGarantiesFinancièresFixture } from './fixtures/enregistrerAttestationGarantiesFinancières.fixture';

export class GarantiesFinancièresActuellesWorld {
  readonly modifier: ModifierGarantiesFinancièresFixture;
  readonly enregistrer: EnregistrerGarantiesFinancièresFixture;
  readonly enregistrerAttestation: EnregistrerAttestationGarantiesFinancièresFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.modifier = new ModifierGarantiesFinancièresFixture(this);
    this.enregistrer = new EnregistrerGarantiesFinancièresFixture(this);
    this.enregistrerAttestation = new EnregistrerAttestationGarantiesFinancièresFixture(this);
  }

  mapExempleToFixtureValues(exemple: Record<string, string>): EnregistrerGarantiesFinancièresProps {
    const garantiesFinancièresMapper: FieldToExempleMapper<
      Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase['data']['garantiesFinancièresValue']
    > = {
      type: ['type GF'],
      dateÉchéance: ["date d'échéance", mapDateTime],
      dateDélibération: ['date de délibération', mapDateTime],
    };

    return {
      garantiesFinancières: mapToExemple(exemple, garantiesFinancièresMapper),
      dateConstitution: mapDateTime(exemple['date de constitution']),
    };
  }
  mapToExpected(): GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    const identifiantProjet = this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet;
    const actions = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe));

    const garantiesFinancières = actions.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.mapToExpected(),
      }),
      {} as GarantiesFinancières.GarantiesFinancièresReadModel,
    );
    return {
      identifiantProjet,
      garantiesFinancières,
    };
  }
  mapToAttestation() {
    const lastAction = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe))
      .pop();
    return { content: lastAction?.content, format: lastAction?.attestation.format };
  }
}
