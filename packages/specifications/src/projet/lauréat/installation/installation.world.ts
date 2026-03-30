import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatWorld } from '../lauréat.world.js';

import { ModifierDispositifDeStockageFixture } from './fixture/modifierDispositifDeStockage.fixture.js';
import { ModifierInstallateurFixture } from './fixture/modifierInstallateur.fixture.js';
import { ModifierTypologieInstallationFixture } from './fixture/modifierTypologieInstallation.fixture.js';
import { EnregistrerChangementInstallateurFixture } from './fixture/enregistrerChangementInstallateur.fixture.js';
import { EnregistrerChangementDispositifDeStockageFixture } from './fixture/enregistrerChangementDispositifStockage.fixture.js';

export class InstallationWorld {
  #modifierInstallateurFixture: ModifierInstallateurFixture;
  get modifierInstallateurFixture() {
    return this.#modifierInstallateurFixture;
  }

  #modifierTypologieInstallationFixture: ModifierTypologieInstallationFixture;
  get modifierTypologieInstallationFixture() {
    return this.#modifierTypologieInstallationFixture;
  }

  #modifierDispositifDeStockageFixture: ModifierDispositifDeStockageFixture;
  get modifierDispositifDeStockageFixture() {
    return this.#modifierDispositifDeStockageFixture;
  }

  #enregistrerChangementDispositifDeStockageFixture: EnregistrerChangementDispositifDeStockageFixture;
  get enregistrerChangementDispositifDeStockageFixture() {
    return this.#enregistrerChangementDispositifDeStockageFixture;
  }

  #enregistrerChangementInstallateurFixture: EnregistrerChangementInstallateurFixture;
  get enregistrerChangementInstallateurFixture() {
    return this.#enregistrerChangementInstallateurFixture;
  }

  constructor(public readonly lauréatWorld: LauréatWorld) {
    this.#modifierInstallateurFixture = new ModifierInstallateurFixture();
    this.#modifierTypologieInstallationFixture = new ModifierTypologieInstallationFixture(
      lauréatWorld,
    );
    this.#modifierDispositifDeStockageFixture = new ModifierDispositifDeStockageFixture();
    this.#enregistrerChangementInstallateurFixture = new EnregistrerChangementInstallateurFixture();
    this.#enregistrerChangementDispositifDeStockageFixture =
      new EnregistrerChangementDispositifDeStockageFixture();
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    const installateurÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.installateur ?? '';

    const typologieInstallationÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.typologieInstallation;

    const dispositifDeStockageÀLaCandidature =
      this.lauréatWorld.candidatureWorld.importerCandidature.dépôtValue.dispositifDeStockage;

    if (
      !installateurÀLaCandidature &&
      !typologieInstallationÀLaCandidature &&
      !dispositifDeStockageÀLaCandidature
    ) {
      return Option.none;
    }

    const expected: Lauréat.Installation.ConsulterInstallationReadModel = {
      identifiantProjet,
      installateur: this.#enregistrerChangementInstallateurFixture.aÉtéCréé
        ? this.#enregistrerChangementInstallateurFixture.installateur
        : this.#modifierInstallateurFixture.aÉtéCréé
          ? this.#modifierInstallateurFixture.installateur
          : installateurÀLaCandidature,
      typologieInstallation: this.#modifierTypologieInstallationFixture.aÉtéCréé
        ? this.#modifierTypologieInstallationFixture.typologieInstallation.map(
            Candidature.TypologieInstallation.convertirEnValueType,
          )
        : typologieInstallationÀLaCandidature.map(
            Candidature.TypologieInstallation.convertirEnValueType,
          ),
      dispositifDeStockage: this.#enregistrerChangementDispositifDeStockageFixture.aÉtéCréé
        ? Lauréat.Installation.DispositifDeStockage.convertirEnValueType(
            this.#enregistrerChangementDispositifDeStockageFixture.dispositifDeStockage,
          )
        : this.#modifierDispositifDeStockageFixture.aÉtéCréé
          ? Lauréat.Installation.DispositifDeStockage.convertirEnValueType(
              this.#modifierDispositifDeStockageFixture.dispositifDeStockage,
            )
          : dispositifDeStockageÀLaCandidature &&
            Lauréat.Installation.DispositifDeStockage.convertirEnValueType(
              dispositifDeStockageÀLaCandidature,
            ),
    };

    return expected;
  }

  mapChangementInstallateurToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.#enregistrerChangementInstallateurFixture.aÉtéCréé) {
      throw new Error(
        `Aucune information enregistrée n'a été créée pour installateur dans InstallationWorld`,
      );
    }

    const expected: Lauréat.Installation.ConsulterChangementInstallateurReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(
          this.#enregistrerChangementInstallateurFixture.enregistréLe,
        ),
        enregistréPar: Email.convertirEnValueType(
          this.#enregistrerChangementInstallateurFixture.enregistréPar,
        ),
        installateur: this.#enregistrerChangementInstallateurFixture.installateur,
        pièceJustificative: Lauréat.Installation.DocumentInstallateur.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréeLe: this.#enregistrerChangementInstallateurFixture.enregistréLe,
          pièceJustificative: {
            format: this.#enregistrerChangementInstallateurFixture.pièceJustificative?.format,
          },
        }),
        raison: this.#enregistrerChangementInstallateurFixture.raison,
      },
    };

    return expected;
  }

  mapJustificatifChangementInstallateurToExpected():
    | { format: string; content: string }
    | undefined {
    return this.#enregistrerChangementInstallateurFixture.pièceJustificative;
  }

  mapChangementDispositifDeStockageToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    if (!this.#enregistrerChangementDispositifDeStockageFixture.aÉtéCréé) {
      throw new Error(
        `Aucune information enregistrée n'a été créée pour le dispositif de stockage dans InstallationWorld`,
      );
    }

    const expected: Lauréat.Installation.ConsulterChangementDispositifDeStockageReadModel = {
      identifiantProjet,
      changement: {
        enregistréLe: DateTime.convertirEnValueType(
          this.#enregistrerChangementDispositifDeStockageFixture.enregistréLe,
        ),
        enregistréPar: Email.convertirEnValueType(
          this.#enregistrerChangementDispositifDeStockageFixture.enregistréPar,
        ),
        dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.convertirEnValueType(
          this.#enregistrerChangementDispositifDeStockageFixture.dispositifDeStockage,
        ),
        pièceJustificative: Lauréat.Installation.DocumentDispositifDeStockage.pièceJustificative({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: DateTime.convertirEnValueType(
            this.#enregistrerChangementDispositifDeStockageFixture.enregistréLe,
          ).formatter(),
          pièceJustificative:
            this.#enregistrerChangementDispositifDeStockageFixture.pièceJustificative,
        }),
        raison: this.#enregistrerChangementDispositifDeStockageFixture.raison,
      },
    };

    return expected;
  }

  mapJustificatifChangementDispositifDeStockageToExpected():
    | { format: string; content: string }
    | undefined {
    return this.#enregistrerChangementDispositifDeStockageFixture.pièceJustificative;
  }
}
