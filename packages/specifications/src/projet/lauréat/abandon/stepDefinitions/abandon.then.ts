import { Then as Alors } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { convertirEnIdentifiantProjet, loadAbandonAggregateFactory } from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views/src/projet/consulter/consulterProjet.query';
import {
  ListerProjetEnAttenteRecandidatureQuery,
  ConsulterPiéceJustificativeAbandonProjetQuery,
} from '@potentiel/domain-views';
import { expect } from 'chai';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  `la recandidature du projet {string} devrait être consultable dans la liste des projets lauréat abandonnés devant recandidater`,
  async function (this: PotentielWorld, nomProjet: string) {
    const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // Assert de l'aggrégat
    const actualProjetAggregate = await loadAbandonAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(lauréat.identifiantProjet));

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat abandon n'existe pas !`);
    }

    const actual = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
      data: {
        identifiantProjet: lauréat.identifiantProjet,
      },
    });

    if (isNone(actual)) {
      throw new Error('Projet non trouvée');
    }

    const piéceJustificativeAbandon =
      await mediator.send<ConsulterPiéceJustificativeAbandonProjetQuery>({
        type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
        data: {
          identifiantProjet: lauréat.identifiantProjet,
        },
      });

    if (isNone(piéceJustificativeAbandon)) {
      throw new Error('Piéce justificative non trouvée');
    }

    const actualFormat = piéceJustificativeAbandon.format;
    const expectedFormat = this.lauréatWorld.abandonWorld.piéceJustificative.format;
    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableStreamToString(piéceJustificativeAbandon.content);
    const expectedContent = this.lauréatWorld.abandonWorld.piéceJustificative.content;
    actualContent.should.be.equal(expectedContent);

    const expected = {
      ...lauréat.projet,
      piéceJustificative: {
        format: expectedFormat,
      },
      statut: 'abandonné',
      dateAbandon: this.lauréatWorld.abandonWorld.dateAbandon.toISOString(),
      recandidature: this.lauréatWorld.abandonWorld.recandidature,
    };

    actual.should.be.deep.equal(expected);
  },
);

Alors(
  `le projet {string} devrait être disponible dans la liste des recandidatures attendues`,
  async function (this: PotentielWorld, nomProjet: string) {
    const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const listeRecandidatureEnAttente =
      await mediator.send<ListerProjetEnAttenteRecandidatureQuery>({
        type: 'LISTER_PROJET_EN_ATTENTE_RECANDIDATURE_QUERY',
        data: {
          pagination: {
            itemsPerPage: 1,
            page: 1,
          },
        },
      });

    const actual = listeRecandidatureEnAttente.items.find(
      (r) =>
        r.appelOffre === lauréat.identifiantProjet.appelOffre &&
        r.période === lauréat.identifiantProjet.période &&
        r.numéroCRE === lauréat.identifiantProjet.numéroCRE &&
        r.famille ===
          (isSome(lauréat.identifiantProjet.famille) ? lauréat.identifiantProjet.famille : ''),
    );

    expect(actual).to.be.not.undefined;
  },
);
