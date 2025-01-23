import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';

import { Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

import { vérifierDossierRaccordement } from './raccordement.then';

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      vérifierRaccordement.call(this, identifiantProjet, raccordement);
      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);

      assert(Option.isSome(dossierRaccordement), 'dossierRaccordement is undefined');
      assert(
        dossierRaccordement.demandeComplèteRaccordement,
        'demandeComplèteRaccordement is undefined',
      );
      const actualAccuséRéception = dossierRaccordement.demandeComplèteRaccordement.accuséRéception;
      const { accuséRéception: expectedAccuséRéception } = this.raccordementWorld
        .demandeComplèteDeRaccordement.modifierFixture.aÉtéCréé
        ? this.raccordementWorld.demandeComplèteDeRaccordement.modifierFixture
        : this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

      assert(actualAccuséRéception, 'actualAccuséRéception is not defined');
      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: actualAccuséRéception.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(expectedAccuséRéception.content);
      actualContent.should.be.equal(expectedContent);
    });
  },
);

function vérifierRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  raccordement: Option.Type<Raccordement.ConsulterRaccordementReadModel>,
) {
  const { raccordement: expectedRaccordement } = mapToPlainObject(
    this.raccordementWorld.mapToExpected(identifiantProjet),
  );
  const actualRaccordement = mapToPlainObject(raccordement);

  // HACK : misÀJourLe vaut la date de l'event (created_at),
  //  on ne peut pas calculer cette date de manière exacte dans les tests
  if (Option.isSome(actualRaccordement)) {
    for (const doss of actualRaccordement.dossiers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (doss as any).misÀJourLe;
    }
  }

  actualRaccordement.should.be.deep.equal(
    expectedRaccordement,
    `le raccordement n'est pas identique`,
  );
}
