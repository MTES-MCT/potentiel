import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';
import { modifierGarantiesFinancièresActuelles } from '../../actuelles/stepDefinitions/garantiesFinancièresActuelles.given';
import { exécuterTâchePlanifiée } from '../../../../../tâche-planifiée/stepDefinitions/tâchePlanifiée.when';

import {
  accorderMainlevée,
  demanderMainlevée,
  démarrerInstructionMainlevée,
  rejeterMainlevée,
} from './mainlevéeGarantiesFinancières.when';

EtantDonné(
  'une demande de mainlevée de garanties financières',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    await demanderMainlevée.call(
      this,
      this.lauréatWorld.garantiesFinancièresWorld.mainlevée.mapToExemple(exemple),
    );
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières en instruction',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await démarrerInstructionMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières accordée',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await accorderMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières rejetée',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this);
    await rejeterMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée pour des garanties financières échues',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const dateÉchéance = DateTime.convertirEnValueType(new Date('2050-07-17'));
    await modifierGarantiesFinancièresActuelles.call(this, identifiantProjet, {
      type: 'avec-date-échéance' as const,
      dateÉchéance: dateÉchéance.formatter(),
    });

    await demanderMainlevée.call(this);

    await exécuterTâchePlanifiée.call(
      this,
      identifiantProjet,
      Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
      dateÉchéance.ajouterNombreDeJours(1).date,
    );
  },
);
