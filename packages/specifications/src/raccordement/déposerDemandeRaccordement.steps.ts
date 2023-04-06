import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { publish } from '@potentiel/pg-event-sourcing';
import { RaccordementWorld } from './raccordement.world';

EtantDonné('un projet', function (this: RaccordementWorld) {
  this.identifiantProjet = {
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    numéroCRE: '23',
  };
});

Quand(
  `le porteur du projet dépose une demande de raccordement auprès d'un gestionnaire de réseau`,
  async function (this: RaccordementWorld) {
    type IdentifiantGestionnaireRéseau = {
      codeEIC: string;
    };

    const identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau = {
      codeEIC: '17X100A100A0001A',
    };

    const command = {
      identifiantProjet: this.identifiantProjet,
      identifiantGestionnaireRéseau: 'codeEIC',
    };

    const déposerDemandeRaccordement = déposerDemandeRaccordementCommandHandlerFactory({
      publish,
    });

    await déposerDemandeRaccordement(command);
  },
);

Alors(
  'le projet devrait avoir une demande de raccordement pour le gestionnaire de réseau {string}',
  function (nomDuGestionnaire: string) {},
);

Alors(
  'la demande est consultable dans la liste des demandes de raccordement du projet',
  function () {},
);
