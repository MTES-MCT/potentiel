import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  'une attestation de conformité devrait être consultable pour le projet lauréat',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = this.lauréatWorld.identifiantProjet;

      const achèvement = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const expected = this.lauréatWorld.achèvementWorld.mapToExpected(identifiantProjet);

      achèvement.should.be.deep.equal(expected);

      // ajouter content / format
      // fusionner transmettre et modifier Fixture (même payload)
    });
  },
);
