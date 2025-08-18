import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';

import {
  enregistrerAttestation,
  enregistrerGarantiesFinancièresActuelles,
  modifierGarantiesFinancièresActuelles,
} from './garantiesFinancièresActuelles.given';

Quand(
  `un admin modifie les garanties financières actuelles du projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      await modifierGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un admin modifie les garanties financières actuelles du projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      await modifierGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        {},
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      await enregistrerAttestation.call(this, this.lauréatWorld.identifiantProjet, {});
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await enregistrerAttestation.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur enregistre les garanties financières actuelles pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      await enregistrerGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        {},
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);
Quand(
  `un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await enregistrerGarantiesFinancièresActuelles.call(
        this,
        this.lauréatWorld.identifiantProjet,
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.mapExempleToFixtureValues(exemple),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un admin échoie les garanties financières actuelles pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<Lauréat.TâchePlanifiée.ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          typeTâchePlanifiéeValue:
            Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
