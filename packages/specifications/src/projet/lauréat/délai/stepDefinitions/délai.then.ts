import { Then as Alors } from '@cucumber/cucumber';
import { assert } from 'chai';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  'la demande de {string} devrait être consultable',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.demandé,
      motif,
    );
  },
);

Alors(
  'la demande de {string} ne devrait plus être consultable',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const demandeFixture = this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandeOrThrow(
        this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
      );

      const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe: demandeFixture.demandéLe,
        },
      });

      Option.isNone(demande).should.be.true;
    });
  },
);

Alors(
  `la demande de {string} devrait être annulée`,
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.annulé,
      motif,
    );
  },
);

Alors(
  `la demande de {string} devrait être en instruction`,
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.enInstruction,
      motif,
    );
  },
);

Alors(
  'la demande de {string} devrait être rejetée',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    return waitForExpect(async () => {
      await vérifierDemandeDélai.call(
        this,
        this.candidatureWorld.importerCandidature.identifiantProjet,
        Lauréat.Délai.StatutDemandeDélai.rejeté,
        motif,
      );
    });
  },
);

Alors(
  'la demande de {string} devrait être accordée',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    return waitForExpect(async () => {
      await vérifierDemandeDélai.call(
        this,
        this.candidatureWorld.importerCandidature.identifiantProjet,
        Lauréat.Délai.StatutDemandeDélai.accordé,
        motif,
      );
    });
  },
);

async function vérifierDemandeDélai(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
  motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
) {
  return waitForExpect(async () => {
    const demandeFixture = this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandeOrThrow(
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    );

    const demandeEnCours = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet,
        demandéLe: demandeFixture.demandéLe,
      },
    });

    assert(Option.isSome(demandeEnCours), 'Demande de délai non trouvée !');

    const actual = mapToPlainObject(demandeEnCours);
    const expected = mapToPlainObject(
      this.lauréatWorld.délaiWorld.mapToExpected(statut, demandeFixture?.motif),
    );

    actual.should.be.deep.equal(expected);
  });
}
