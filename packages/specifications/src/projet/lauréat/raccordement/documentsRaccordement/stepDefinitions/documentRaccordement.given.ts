import { Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { PotentielWorld } from '../../../../../potentiel.world.js';
import { transmettreDocumentRaccordement } from './documentRaccordement.when.js';

EtantDonné('un document transmis pour le projet lauréat', async function (this: PotentielWorld) {
  const { identifiantProjet, référenceDossier } =
    this.lauréatWorld.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

  await transmettreDocumentRaccordement.call(this, identifiantProjet, référenceDossier);
});

EtantDonné(
  /une (proposition technique et financière|convention de raccordement|convention directe de raccordement) pour le projet lauréat/,
  async function (this: PotentielWorld, typeDocument: string) {
    const { identifiantProjet, référenceDossier } =
      this.lauréatWorld.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const type = match(typeDocument)
      .returnType<Lauréat.Raccordement.TypeDocumentsRaccordement.RawType>()
      .with('convention de raccordement', () => 'convention-de-raccordement')
      .with('convention directe de raccordement', () => 'convention-directe-de-raccordement')
      .with('proposition technique et financière', () => 'proposition-technique-et-financière')
      .otherwise(() => 'proposition-technique-et-financière');

    await transmettreDocumentRaccordement.call(this, identifiantProjet, référenceDossier, { type });
  },
);
