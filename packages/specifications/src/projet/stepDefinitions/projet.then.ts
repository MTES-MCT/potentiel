import { Then as Alors } from '@cucumber/cucumber';

import { expect } from 'chai';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  `le projet {string} devrait avoir comme gestionaire de réseau {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    const résultat = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(résultat)) {
      throw new Error('Projet non trouvé');
    }

    expect(résultat.identifiantGestionnaire).to.deep.equal({
      codeEIC,
    });
  },
);
