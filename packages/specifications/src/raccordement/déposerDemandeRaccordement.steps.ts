import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';

EtantDonné('un projet', function () {});

Quand(
  'le porteur du projet dépose une demande de raccordement auprès du gestionnaire de réseau {string}',
  function (nomDuGestionnaire: string) {},
);

Alors(
  'le projet devrait avoir une demande de raccordement pour le gestionnaire de réseau {string}',
  function (nomDuGestionnaire: string) {},
);
