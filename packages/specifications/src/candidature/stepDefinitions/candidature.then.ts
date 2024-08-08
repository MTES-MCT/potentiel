import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures avec le statut {string}',
  async function (this: PotentielWorld, nomProjet: string, statut: string) {
    const { identifiantProjet } = this.candidatureWorld.rechercherCandidatureFixture(nomProjet);

    await waitForExpect(async () => {
      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });
      assert(Option.isSome(candidature), 'Candidature non trouvée');
      expect(candidature.nom).to.eq(nomProjet);
      expect(candidature.statut).to.eq(statut);
    });
  },
);
