import { Given as EtantDonné } from '@cucumber/cucumber';
import { none } from '@potentiel/monads';
import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
  this.lauréatWorld.lauréatFixtures.set(nomProjet, {
    nom: nomProjet,
    identifiantProjet: {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    },
  });
});
