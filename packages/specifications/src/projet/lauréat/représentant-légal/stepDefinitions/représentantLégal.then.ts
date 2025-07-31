import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  /le représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );
      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  `le représentant légal du projet lauréat( ne) devrait( pas) être mis à jour`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  'le document sensible fourni lors du changement de représentant légal devrait être remplacé',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const changement =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            demandéLe:
              this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
                .demanderOuEnregistrerChangementReprésentantLégalFixture.demandéLe,
          },
        });

      assert(Option.isSome(changement), 'Aucun changement de représentant légal trouvé');

      const document = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: changement.demande.pièceJustificative.formatter(),
        },
      });

      assert(Option.isSome(document));

      const actualContent = await convertReadableStreamToString(document.content);
      const oldContent = await convertReadableStreamToString(
        this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld
          .demanderOuEnregistrerChangementReprésentantLégalFixture.pièceJustificative.content,
      );
      actualContent.should.not.be.equal(oldContent);
    });
  },
);
