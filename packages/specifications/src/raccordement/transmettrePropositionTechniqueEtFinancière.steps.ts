import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour une demande complète de raccordement avec la date de signature au "{string}"`,
  async function (this: PotentielWorld, dateSignature: string) {
    await this.raccordementWorld.createDemandeComplèteRaccordement();
  },
);

Alors(
  `une proposition technique et financière devrait être consultable dans la demande complète de raccordement avec une date de signature au au "{string}"`,
  function (this: PotentielWorld, dateSignature: string) {},
);
