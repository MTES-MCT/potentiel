import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Alors('la demande de délai devrait être consultable', async function (this: PotentielWorld) {
  await vérifierDemandeDélai.call(
    this,
    this.candidatureWorld.importerCandidature.identifiantProjet,
    Lauréat.Délai.StatutDemandeDélai.demandé,
  );
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
