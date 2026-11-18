import { Then as Alors } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
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
  'la demande de {string} en cours devrait être consultable',
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

      const motifDemande =
        motif === "prolongation de phase d'essai"
          ? Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai.formatter()
          : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter();

      const demandeFixture =
        this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.get(motifDemande);

      if (!demandeFixture) {
        throw new Error('Demande fixture inexistante');
      }

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

// viovio : ça devrait être dans la consultation
Alors(
  /l'autorité instructrice de la demande de délai devrait être (.*)/,
  async function (this: PotentielWorld, autorité: string) {
    const demandeFixture = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes
      .values()
      .next().value;

    if (!demandeFixture) {
      throw new Error('Demande fixture inexistante');
    }
    const demandeEnCours = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        demandéLe: demandeFixture.demandéLe,
      },
    });
    assert(Option.isSome(demandeEnCours), 'Demande de délai non trouvée !');
    const expected = autorité.includes('DGEC')
      ? Lauréat.Délai.AutoritéCompétente.dgec
      : Lauréat.Délai.AutoritéCompétente.dreal;
    expect(demandeEnCours.autoritéCompétente?.autoritéCompétente).to.equal(
      expected.autoritéCompétente,
    );
  },
);

async function vérifierDemandeDélai(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
  motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
) {
  return waitForExpect(async () => {
    const motifVT =
      motif === "prolongation de phase d'essai"
        ? Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai
        : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;

    const demandeFixture = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.get(
      motifVT.formatter(),
    );

    const demandeEnCours = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet,
        demandéLe: demandeFixture?.demandéLe ?? '',
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
