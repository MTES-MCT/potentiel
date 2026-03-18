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

  mapToExpected(): Omit<
    Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel,
    'archives'
  > {
    const identifiantProjet = this.garantiesFinancièresWorld.lauréatWorld.identifiantProjet;

    const actions = [this.enregistrer, this.modifier, this.enregistrerAttestation]
      .filter((action) => action.aÉtéCréé)
      .sort((a, b) => {
        const aDate = a.enregistréLe;
        const bDate = b.enregistréLe;

        return aDate.localeCompare(bDate);
      });

    const candidatureInitiale =
      this.garantiesFinancièresWorld.lauréatWorld.candidatureWorld.importerCandidature;
    const { notifiéLe } = this.garantiesFinancièresWorld.lauréatWorld.notifierLauréatFixture;

    const {
      typeGarantiesFinancières,
      dateÉchéanceGf,
      dateConstitutionGf,
      attestationConstitutionGf,
    } = candidatureInitiale.dépôtValue;

    let gfReadModel: Omit<
      Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel,
      'archives'
    > = typeGarantiesFinancières
      ? {
          identifiantProjet,
          garantiesFinancières:
            Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
              type: typeGarantiesFinancières,
              dateÉchéance: dateÉchéanceGf,
              constitution: this.importer.aÉtéCréé
                ? {
                    attestation: this.importer.attestation,
                    date: this.importer.dateConstitution,
                  }
                : dateConstitutionGf && attestationConstitutionGf
                  ? {
                      attestation: attestationConstitutionGf,
                      date: dateConstitutionGf,
                    }
                  : undefined,
            }),
          statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(notifiéLe),
          },
          document: this.importer.aÉtéCréé ? this.importer.mapToExpected().document : undefined,
        }
      : ({} as Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel);

    for (const action of actions) {
      gfReadModel = action.mapToExpected();
    }

    const sontÉchues =
      Object.keys(gfReadModel).length &&
      gfReadModel.garantiesFinancières.estAvecDateÉchéance() &&
      gfReadModel.garantiesFinancières.dateÉchéance.estPassée();

    if (sontÉchues && gfReadModel.garantiesFinancières.estAvecDateÉchéance()) {
      gfReadModel.statut = Lauréat.GarantiesFinancières.StatutGarantiesFinancières.échu;
      gfReadModel.dateLimiteSoumission = gfReadModel.dernièreMiseÀJour.date.ajouterNombreDeMois(2);
      gfReadModel.motifEnAttente =
        Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.échéanceGarantiesFinancièresActuelles;
    }

    return gfReadModel;
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
