import { Then as Alors } from '@cucumber/cucumber';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau.world';

Alors(
  /l'administrateur devrait être informé que "(.*)"/,
  function (this: GestionnaireRéseauWorld, message: string) {
    this.error?.message.should.be.equal(message);
  },
);
