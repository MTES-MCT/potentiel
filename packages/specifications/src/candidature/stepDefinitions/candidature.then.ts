import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { StatutProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures avec le statut {string}',
  async function (this: PotentielWorld, nomProjet: string, statut: string) {
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });
      assert(Option.isSome(candidature), 'Candidature non trouvée');
      expect(candidature.nomProjet).to.eq(nomProjet);
      expect(candidature.statut.estÉgaleÀ(StatutProjet.convertirEnValueType(statut))).to.be.true;
    });
  },
);

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet, values } =
      this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });
      assert(Option.isSome(candidature), 'Candidature non trouvée');
      expect(candidature.nomProjet).to.eq(nomProjet);
      expect(candidature.statut.estÉgaleÀ(StatutProjet.convertirEnValueType(values.statutValue))).to
        .be.true;
    });
  },
);
