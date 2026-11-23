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
  'une demande de {string} en cours pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif:
        motif === "prolongation de phase d'essai"
          ? Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai.formatter()
          : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter(),
    });
  },
);

EtantDonné(
  'une demande de {string} en cours pour le projet lauréat avec :',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
    table: DataTable,
  ) {
    const exemple = table.rowsHash();

    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
      ...this.lauréatWorld.délaiWorld.mapExempleToFixtureValues(exemple),
    });
  },
);

EtantDonné(
  'une demande de {string} annulée pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    const motifVT = this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter();

    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motifVT,
    });

    await annulerDemandeDélai.call(this, motifVT);
  },
);

EtantDonné(
  'une demande de {string} en instruction pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    const motifVT = this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter();

    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motifVT,
    });

    await passerDemanderDélaiEnInstruction.call(this, motifVT);
  },
);

EtantDonné(
  'une demande de {string} rejetée pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    const motifVT = this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter();

    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motifVT,
    });
    await rejeterDemandeDélai.call(this, motifVT);
  },
);

EtantDonné(
  'une demande de {string} accordée pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    const motifVT = this.lauréatWorld.délaiWorld.getMotifFromLabel(motif);
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motifVT.formatter(),
    });
    const autoritéCompétente = this.lauréatWorld.cahierDesCharges.getAutoritéCompétente({
      domain: 'délai',
      motif: motifVT,
    });
    await accorderDemandeDélai.call(this, {
      rôle: autoritéCompétente,
      motif: motifVT.formatter(),
    });
  },
);
