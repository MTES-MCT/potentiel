import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

EtantDonné(`une demande complète de raccordement`, async function (this: PotentielWorld) {
  await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
    this.raccordementWorld.enedis.codeEIC,
    this.raccordementWorld.enedis.raisonSociale,
  );

  const transmettreDemandeComplèteRaccordement =
    transmettreDemandeComplèteRaccordementCommandHandlerFactory({
      loadAggregate,
      publish,
    });

  await transmettreDemandeComplèteRaccordement({
    identifiantProjet: this.raccordementWorld.identifiantProjet,
    identifiantGestionnaireRéseau: {
      codeEIC: this.raccordementWorld.enedis.codeEIC,
    },
    dateQualification: new Date('2022-12-31'),
    référenceDemandeRaccordement: 'UNE-REFERENCE-DCR',
  });
});

Quand(
  `le porteur de projet transmet une proposition technique et financière pour la demande complète de raccordement avec la date de signature au "{string}"`,
  function () {},
);

Alors(
  `une proposition technique et financière devrait être consultable dans la demande complète de raccordement avec une date de signature au au "{string}"`,
  function () {},
);
