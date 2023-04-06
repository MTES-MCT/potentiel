import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { RaccordementWorld } from './raccordement.world';

EtantDonné('un projet', function (this: RaccordementWorld) {
  type IdentifiantProjet = {
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
  };

  const identifiantProjet: IdentifiantProjet = {
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    numéroCRE: '23',
  };

  this.identifiantProjet = identifiantProjet.format(identifiantProjet);
});

Quand(
  'le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau {string}',
  function (nomDuGestionnaire: string) {},
);

Alors(
  'le projet devrait avoir une demande de raccordement pour le gestionnaire de réseau {string}',
  function (nomDuGestionnaire: string) {},
);

Alors(
  'la demande est consultable dans la liste des demandes de raccordement du projet',
  function () {},
);
