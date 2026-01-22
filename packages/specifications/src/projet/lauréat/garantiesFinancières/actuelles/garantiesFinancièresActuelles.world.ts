import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { GarantiesFinancièresWorld } from '../garantiesFinancières.world.js';
import {
  FieldToExempleMapper,
  mapDateTime,
  mapToExemple,
} from '../../../../helpers/mapToExemple.js';

import {
  EnregistrerGarantiesFinancièresFixture,
  EnregistrerGarantiesFinancièresProps,
} from './fixtures/enregistrerGarantiesFinancières.fixture.js';
import { ModifierGarantiesFinancièresFixture } from './fixtures/modifierGarantiesFinancières.fixture.js';
import { EnregistrerAttestationGarantiesFinancièresFixture } from './fixtures/enregistrerAttestationGarantiesFinancières.fixture.js';
import { DemanderGarantiesFinancièresFixture } from './fixtures/demanderGarantiesFinancières.fixture.js';
import { ImporterGarantiesFinancièresFixture } from './fixtures/importerGarantiesFinancières.fixture.js';

export class GarantiesFinancièresActuellesWorld {
  readonly modifier: ModifierGarantiesFinancièresFixture;
  readonly enregistrer: EnregistrerGarantiesFinancièresFixture;
  readonly enregistrerAttestation: EnregistrerAttestationGarantiesFinancièresFixture;
  readonly demander: DemanderGarantiesFinancièresFixture;
  readonly importer: ImporterGarantiesFinancièresFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.modifier = new ModifierGarantiesFinancièresFixture(this);
    this.enregistrer = new EnregistrerGarantiesFinancièresFixture(this);
    this.enregistrerAttestation = new EnregistrerAttestationGarantiesFinancièresFixture(this);
    this.demander = new DemanderGarantiesFinancièresFixture(this);
    this.importer = new ImporterGarantiesFinancièresFixture(this);
  }

  mapExempleToFixtureValues(exemple: Record<string, string>): EnregistrerGarantiesFinancièresProps {
    const garantiesFinancièresMap: FieldToExempleMapper<EnregistrerGarantiesFinancièresProps> = {
      type: ['type GF'],
      dateConstitution: ['date de constitution', mapDateTime],
      dateÉchéance: ["date d'échéance", mapDateTime],
    };

    return mapToExemple(exemple, garantiesFinancièresMap);
  }

  mapToExpected(): Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    const identifiantProjet = this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet;
    const actions = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe));

    const { dépôtValue: dépôtCandidature } =
      this.garantiesFinancièresWorld.lauréatWorld.candidatureWorld.importerCandidature;
    const { notifiéLe } = this.garantiesFinancièresWorld.lauréatWorld.notifierLauréatFixture;

    const {
      typeGarantiesFinancières,
      dateÉchéanceGf,
      dateConstitutionGf,
      attestationConstitutionGf,
    } = dépôtCandidature;

    const garantiesFinancièresÀLaDésignation = typeGarantiesFinancières
      ? ({
          garantiesFinancières:
            Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
              type: typeGarantiesFinancières,
              dateÉchéance: dateÉchéanceGf,
              attestation: this.importer.aÉtéCréé
                ? this.importer.attestation
                : attestationConstitutionGf,
              dateConstitution: this.importer.aÉtéCréé
                ? this.importer.dateConstitution
                : dateConstitutionGf,
            }),
          statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(notifiéLe),
          },
          identifiantProjet,
          document: this.importer.aÉtéCréé ? this.importer.mapToExpected().document : undefined,
        } satisfies Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel)
      : ({} as Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel);

    const readModel = actions.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.mapToExpected(),
      }),
      garantiesFinancièresÀLaDésignation,
    );

    const sontÉchues =
      readModel.garantiesFinancières.estAvecDateÉchéance() &&
      readModel.garantiesFinancières.dateÉchéance.estPassée();

    if (sontÉchues) {
      readModel.statut = Lauréat.GarantiesFinancières.StatutGarantiesFinancières.échu;
    }
    return readModel;
  }
  mapToAttestation() {
    const lastAction = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe))
      .pop();
    if (lastAction) {
      return lastAction.attestation;
    }

    return this.importer.attestation;
  }
}
