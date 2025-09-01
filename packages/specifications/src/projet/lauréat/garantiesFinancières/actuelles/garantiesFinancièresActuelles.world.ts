import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
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
      dateDélibération: ['date de délibération', mapDateTime],
    };

    const otherProps = mapToExemple(exemple, {
      dateConstitution: ['date de constitution', mapDateTime],
    });

    return {
      garantiesFinancières: mapToExemple(exemple, garantiesFinancièresMapper),
      ...otherProps,
    };
  }
  mapToExpected(): GarantiesFinancières.ConsulterGarantiesFinancièresReadModel {
    const identifiantProjet = this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet;
    const actions = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => a.enregistréLe.localeCompare(b.enregistréLe));

    const { dépôtValue: dépôtCandidature } =
      this.garantiesFinancièresWorld.lauréatWorld.candidatureWorld.importerCandidature;
    const { notifiéLe } = this.garantiesFinancièresWorld.lauréatWorld.notifierLauréatFixture;

    const { typeGarantiesFinancières, dateÉchéanceGf } = dépôtCandidature;
    const valeurImport = typeGarantiesFinancières
      ? ({
          type: Candidature.TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières),
          dateÉchéance: dateÉchéanceGf ? DateTime.convertirEnValueType(dateÉchéanceGf) : undefined,
          statut: GarantiesFinancières.StatutGarantiesFinancières.validé,
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(notifiéLe),
          },
        } satisfies GarantiesFinancières.GarantiesFinancièresReadModel)
      : ({} as GarantiesFinancières.GarantiesFinancièresReadModel);

    const garantiesFinancières = actions.reduce(
      (prev, curr) => ({
        ...prev,
        ...curr.mapToExpected(),
      }),
      valeurImport,
    );

    const sontÉchues =
      garantiesFinancières.dateÉchéance && !garantiesFinancières.dateÉchéance.estDansLeFutur();

    if (sontÉchues) {
      garantiesFinancières.statut = GarantiesFinancières.StatutGarantiesFinancières.échu;
    }
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
