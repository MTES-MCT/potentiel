import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Lauréat } from '@potentiel-domain/projet';

import type { PotentielWorld } from '../../../../potentiel.world.js';
import {
  accorderDemandeDélai,
  annulerDemandeDélai,
  demanderDélai,
  passerDemanderDélaiEnInstruction,
  rejeterDemandeDélai,
} from './délai.when.js';

EtantDonné(
  'une demande de délai en cours pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
  },
);

EtantDonné(
  'une demande de délai en cours pour le projet lauréat avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      ...this.lauréatWorld.délaiWorld.mapExempleToFixtureValues(exemple),
    });
  },
);

EtantDonné(
  'une demande de délai annulée pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await annulerDemandeDélai.call(this);
  },
);

EtantDonné(
  'une demande de délai en instruction pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await passerDemanderDélaiEnInstruction.call(this);
  },
);

EtantDonné(
  'une demande de délai rejetée pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await rejeterDemandeDélai.call(this);
  },
);

EtantDonné(
  'une demande de délai accordée pour le projet lauréat',
  async function (this: PotentielWorld) {
    const motif = Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motif.formatter(),
    });
    const autoritéCompétente = this.lauréatWorld.cahierDesCharges.getAutoritéCompétente({
      domain: 'délai',
      motif: motif,
    });
    await accorderDemandeDélai.call(this, {
      rôle: autoritéCompétente,
      ancienMotif: motif.formatter(),
      nouveauMotif: motif.formatter(),
    });
  },
);
