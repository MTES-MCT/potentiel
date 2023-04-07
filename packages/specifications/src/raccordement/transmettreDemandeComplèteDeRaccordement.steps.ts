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
  `le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: RaccordementWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDemandeRaccordement = exemple['La référence de la demande de raccordement'];

    type IdentifiantGestionnaireRéseau = {
      codeEIC: string;
    };

    type TransmettreDemandeComplèteRaccordementCommand = {
      identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
      identifiantProjet: IdentifiantProjet;
      dateQualification: Date;
      référenceDemandeRaccordement: string;
    };

    const command: TransmettreDemandeComplèteRaccordementCommand = {
      identifiantProjet: this.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.enedis.codeEIC,
      },
      dateQualification,
      référenceDemandeRaccordement,
    };

    type TransmettreDemandeComplèteRaccordementDependencies = {
      publish: Publish;
    };

    const transmettreDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
      TransmettreDemandeComplèteRaccordementCommand,
      TransmettreDemandeComplèteRaccordementDependencies
    > = ({ publish }) => {
      type DemandeComplèteDeRaccordementTransmiseEvent = DomainEvent<
        'DemandeComplèteDeRaccordementTransmise',
        {
          identifiantProjet: string;
          identifiantGestionnaireRéseau: string;
          dateQualification: string;
          référenceDemandeRaccordement: string;
        }
      >;

      const event: DemandeComplèteDeRaccordementTransmiseEvent = {
        type: 'DemandeComplèteDeRaccordementTransmise',
      };
    };

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        publish,
      });

    await transmettreDemandeComplèteRaccordement(command);
  },
);

Alors(
  'le projet devrait avoir une demande complète de raccordement pour ce gestionnaire de réseau',
  function () {},
);

Alors(
  'la demande est consultable dans la liste des demandes complètes de raccordement du projet',
  function () {},
);
