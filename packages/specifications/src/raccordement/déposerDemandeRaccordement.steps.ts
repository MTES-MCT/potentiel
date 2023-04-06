import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { identifiantProjet } from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';
import { RaccordementWorld } from './raccordement.world';

EtantDonné('un projet', function (this: RaccordementWorld) {
  this.identifiantProjet = identifiantProjet.format({
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    numéroCRE: '23',
  });
});

Quand(
  'le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau {string}',
  async function (this: RaccordementWorld, nomDuGestionnaire: string) {
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
