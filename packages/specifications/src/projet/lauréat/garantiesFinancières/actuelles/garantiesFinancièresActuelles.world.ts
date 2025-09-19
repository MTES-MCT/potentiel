import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { GarantiesFinancièresWorld } from '../garantiesFinancières.world';
import { FieldToExempleMapper, mapDateTime, mapToExemple } from '../../../../helpers/mapToExemple';

import {
  EnregistrerGarantiesFinancièresFixture,
  EnregistrerGarantiesFinancièresProps,
} from './fixtures/enregistrerGarantiesFinancières.fixture';
import { ModifierGarantiesFinancièresFixture } from './fixtures/modifierGarantiesFinancières.fixture';
import { EnregistrerAttestationGarantiesFinancièresFixture } from './fixtures/enregistrerAttestationGarantiesFinancières.fixture';
import { DemanderGarantiesFinancièresFixture } from './fixtures/demanderGarantiesFinancières.fixture';

export class GarantiesFinancièresActuellesWorld {
  readonly modifier: ModifierGarantiesFinancièresFixture;
  readonly enregistrer: EnregistrerGarantiesFinancièresFixture;
  readonly enregistrerAttestation: EnregistrerAttestationGarantiesFinancièresFixture;
  readonly demander: DemanderGarantiesFinancièresFixture;

  constructor(public readonly garantiesFinancièresWorld: GarantiesFinancièresWorld) {
    this.modifier = new ModifierGarantiesFinancièresFixture(this);
    this.enregistrer = new EnregistrerGarantiesFinancièresFixture(this);
    this.enregistrerAttestation = new EnregistrerAttestationGarantiesFinancièresFixture(this);
    this.demander = new DemanderGarantiesFinancièresFixture(this);
  }

  mapExempleToFixtureValues(exemple: Record<string, string>): EnregistrerGarantiesFinancièresProps {
    const garantiesFinancièresMapper: FieldToExempleMapper<
      Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase['data']['garantiesFinancièresValue']
    > = {
      type: ['type GF'],
      dateÉchéance: ["date d'échéance", mapDateTime],
    };

    const otherProps = mapToExemple(exemple, {
      dateConstitution: ['date de constitution', mapDateTime],
    });

    return {
      garantiesFinancières: mapToExemple(exemple, garantiesFinancièresMapper),
      ...otherProps,
    };
  }
  mapToExpected(): Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    const identifiantProjet = this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet;
    const actions = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe));

    const { dépôtValue: dépôtCandidature } =
      this.garantiesFinancièresWorld.lauréatWorld.candidatureWorld.importerCandidature;
    const { notifiéLe } = this.garantiesFinancièresWorld.lauréatWorld.notifierLauréatFixture;

    const { typeGarantiesFinancières, dateÉchéanceGf, dateDélibérationGf } = dépôtCandidature;
    const valeurImport = typeGarantiesFinancières
      ? ({
          garantiesFinancières:
            Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
              type: typeGarantiesFinancières,
              dateÉchéance: dateÉchéanceGf,
            }),
          statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(notifiéLe),
          },
          identifiantProjet,
          dateConstitution: dateDélibérationGf
            ? DateTime.convertirEnValueType(dateDélibérationGf)
            : undefined,
        } satisfies Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel)
      : ({} as Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel);

    const readModel = actions.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.mapToExpected(),
      }),
      valeurImport,
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
  }
}
