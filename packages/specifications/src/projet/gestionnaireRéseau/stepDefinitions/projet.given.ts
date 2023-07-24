import { Given as EtantDonné } from '@cucumber/cucumber';
import { none } from '@potentiel/monads';

import { PotentielWorld } from '../../../potentiel.world';

EtantDonné('le projet {string}', function (this: PotentielWorld, nomProjet: string) {
  this.projetWorld.projetFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    },
  });
});
