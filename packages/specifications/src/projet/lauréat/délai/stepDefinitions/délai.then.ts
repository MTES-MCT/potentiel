import { Then as Alors, type DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Alors(/la demande.* de délai devrait être consultable/, async function (this: PotentielWorld) {
  await vérifierDemandeDélai.call(
    this,
    this.candidatureWorld.importerCandidature.identifiantProjet,
    Lauréat.Délai.StatutDemandeDélai.demandé,
  );
});

Alors(
  'la demande de délai en cours devrait être consultable avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { motif } = this.lauréatWorld.délaiWorld.mapExempleToFixtureValues(exemple);
    if (!motif) {
      throw new Error('Motif à préciser exemple');
    }
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.demandé,
      motif,
    );
  },
);

Alors(
  'la demande de délai ne devrait plus être consultable',
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const demandeFixture = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes
        .values()
        .next().value;

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
  `la demande de délai du projet lauréat devrait être annulée`,
  async function (this: PotentielWorld) {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.annulé,
    );
  },
);

Alors(
  `la demande de délai du projet lauréat devrait être en instruction`,
  async function (this: PotentielWorld) {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.enInstruction,
    );
  },
);

Alors('la demande de délai devrait être rejetée', async function (this: PotentielWorld) {
  return waitForExpect(async () => {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.rejeté,
    );
  });
});

Alors('la demande de délai devrait être accordée', async function (this: PotentielWorld) {
  return waitForExpect(async () => {
    await vérifierDemandeDélai.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Délai.StatutDemandeDélai.accordé,
    );
  });
});

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
  motif?: string,
) {
  return waitForExpect(async () => {
    const demandeFixture = motif
      ? this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.get(
          Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(motif).formatter(),
        )
      : this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.values().next().value;

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
