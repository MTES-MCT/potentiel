import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';

import { setRejetMainlevéeData } from './helper';
import {
  accorderMainlevée,
  demanderMainlevée,
  démarrerInstructionMainlevée,
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
    await demanderMainlevée.call(this, {});
    await démarrerInstructionMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières accordée',
  async function (this: PotentielWorld) {
    await demanderMainlevée.call(this, {});
    await accorderMainlevée.call(this);
  },
);

EtantDonné(
  'une demande de mainlevée de garanties financières rejetée',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await demanderMainlevée.call(this, {});

    await mediator.send<Lauréat.GarantiesFinancières.RejeterMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.RejeterMainlevée',
      data: setRejetMainlevéeData({ identifiantProjet }),
    });
  },
);
