import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  'la puissance du projet lauréat( ne) devrait( pas) être mise à jour',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const puissance = await mediator.send<Lauréat.Puissance.PuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const {
        unitéPuissance,
        dépôt: { puissanceProductionAnnuelle },
      } = this.candidatureWorld.mapToExpected();

      const actual = mapToPlainObject(puissance);
      const expected = mapToPlainObject(
        this.lauréatWorld.puissanceWorld.mapToExpected(
          identifiantProjet,
          puissanceProductionAnnuelle,
          unitéPuissance,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);
