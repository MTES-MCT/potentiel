import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { waitForExpect, expectFileContent } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';
import { vérifierDossierRaccordement } from '../../dossierRaccordement/stepDefinitions/dossierRaccordement.then.js';

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      vérifierRaccordement.call(this, raccordement);
      vérifierDossierRaccordement.call(this, dossierRaccordement);

      assert(Option.isSome(dossierRaccordement), 'dossierRaccordement is undefined');
      assert(
        dossierRaccordement.demandeComplèteRaccordement,
        'demandeComplèteRaccordement is undefined',
      );
      const actualAccuséRéception = dossierRaccordement.demandeComplèteRaccordement.accuséRéception;

      const expectedAccuséRéception = this.raccordementWorld.demandeComplèteDeRaccordement
        .modifierFixture.aÉtéCréé
        ? this.raccordementWorld.demandeComplèteDeRaccordement.modifierFixture.accuséRéception
        : this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture.accuséRéception;

      if (actualAccuséRéception) {
        await expectFileContent(actualAccuséRéception, expectedAccuséRéception);
      }
    });
  },
);

function vérifierRaccordement(
  this: PotentielWorld,
  raccordement: Option.Type<Lauréat.Raccordement.ConsulterRaccordementReadModel>,
) {
  const { raccordement: expectedRaccordement } = mapToPlainObject(
    this.raccordementWorld.mapToExpected(),
  );
  const actualRaccordement = mapToPlainObject(raccordement);

  // HACK : misÀJourLe vaut la date de l'event (created_at),
  //  on ne peut pas calculer cette date de manière exacte dans les tests
  if (Option.isSome(actualRaccordement)) {
    for (const doss of actualRaccordement.dossiers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (doss as any).miseÀJourLe;
    }
  }

  actualRaccordement.should.be.deep.equal(
    expectedRaccordement,
    `le raccordement n'est pas identique`,
  );
}
