import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';

Alors(/la demande.* de délai devrait être consultable/, async function (this: PotentielWorld) {
  await vérifierDemandeDélai.call(
    this,
    this.candidatureWorld.importerCandidature.identifiantProjet,
    Lauréat.Délai.StatutDemandeDélai.demandé,
  );
});

Alors(
  'la demande de délai ne devrait plus être consultable',
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe: this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandéLe,
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

async function vérifierDemandeDélai(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Délai.StatutDemandeDélai.ValueType,
) {
  return waitForExpect(async () => {
    const demandeEnCours = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet,
        demandéLe: this.lauréatWorld.délaiWorld.demanderDélaiFixture.aÉtéCréé
          ? this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandéLe
          : '',
      },
    });

    assert(Option.isSome(demandeEnCours), 'Demande de délai non trouvée !');

    const actual = mapToPlainObject(demandeEnCours);

    const expected = mapToPlainObject(
      this.lauréatWorld.délaiWorld.mapToExpected(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
        statut,
      ),
    );

    actual.should.be.deep.equal(expected);
  });
}
