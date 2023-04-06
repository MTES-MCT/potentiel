import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { publish } from '@potentiel/pg-event-sourcing';
import { RaccordementWorld } from './raccordement.world';
import { CommandHandlerFactory, DomainEvent, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet } from '@potentiel/domain';

EtantDonné('un projet', function (this: RaccordementWorld) {
  this.identifiantProjet = {
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    numéroCRE: '23',
  };
});

Quand(
  `le porteur du projet dépose une demande de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: RaccordementWorld, table: DataTable) {
    const exemple = table.rowsHash();
    type IdentifiantGestionnaireRéseau = {
      codeEIC: string;
    };

    type DéposerDemandeRaccordementCommand = {
      identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
      identifiantProjet: IdentifiantProjet;
    };

    const command: DéposerDemandeRaccordementCommand = {
      identifiantProjet: this.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.enedis.codeEIC,
      },
    };

    type DéposerDemandeRaccordementDependencies = {
      publish: Publish;
    };

    const déposerDemandeRaccordementCommandHandlerFactory: CommandHandlerFactory<
      DéposerDemandeRaccordementCommand,
      DéposerDemandeRaccordementDependencies
    > = ({ publish }) => {
      type DemandeDeRaccordementDéposéeEvent = DomainEvent<'DemandeDeRaccordementDéposée', {}>;

      const event: DemandeDeRaccordementDéposéeEvent = {};
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
