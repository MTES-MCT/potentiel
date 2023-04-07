import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { publish } from '@potentiel/pg-event-sourcing';
import { RaccordementWorld } from './raccordement.world';
import {
  CommandHandlerFactory,
  DomainEvent,
  Find,
  Publish,
  QueryHandlerFactory,
  ReadModel,
} from '@potentiel/core-domain';
import {
  GestionnaireRéseauReadModel,
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { isNone } from '@potentiel/monads';

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
    this.dateQualification = new Date(exemple['La date de qualification']);
    this.référenceDemandeRaccordement = exemple['La référence de la demande de raccordement'];

    const formatIdentifiantGestionnaireRéseau = ({ codeEIC }: IdentifiantGestionnaireRéseau) =>
      codeEIC;

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
      dateQualification: this.dateQualification,
      référenceDemandeRaccordement: this.référenceDemandeRaccordement,
    };

    type TransmettreDemandeComplèteRaccordementDependencies = {
      publish: Publish;
    };

    const transmettreDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
      TransmettreDemandeComplèteRaccordementCommand,
      TransmettreDemandeComplèteRaccordementDependencies
    > =
      ({ publish }) =>
      async ({
        identifiantProjet,
        dateQualification,
        identifiantGestionnaireRéseau,
        référenceDemandeRaccordement,
      }) => {
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
          payload: {
            identifiantProjet: formatIdentifiantProjet(identifiantProjet),
            dateQualification: dateQualification.toISOString(),
            identifiantGestionnaireRéseau: formatIdentifiantGestionnaireRéseau(
              identifiantGestionnaireRéseau,
            ),
            référenceDemandeRaccordement,
          },
        };

        await publish(`demande-complète-raccordement#${référenceDemandeRaccordement}`, event);
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
  function async(this: RaccordementWorld) {
    type ConsulterDemandeComplèteRaccordementQuery = { référenceDemandeRaccordement: string };

    type DemandeComplèteRaccordementReadModel = ReadModel<
      'demande-complète-raccordement',
      {
        référenceDemandeRaccordement: string;
        gestionnaireRéseau: GestionnaireRéseauReadModel;
        dateQualification: string;
      }
    >;

    type ConsulterDemandeComplèteRaccordementDependencies = {
      findDemandeComplèteRaccordement: Find<DemandeComplèteRaccordementReadModel>;
    };

    const consulterDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
      ConsulterDemandeComplèteRaccordementQuery,
      DemandeComplèteRaccordementReadModel,
      ConsulterDemandeComplèteRaccordementDependencies
    > =
      ({ findDemandeComplèteRaccordement }) =>
      async ({ référenceDemandeRaccordement }) => {
        const result = await findDemandeComplèteRaccordement(référenceDemandeRaccordement);
        if (isNone(result)) {
          throw new Error('Not implemented');
        }
        return result;
      };

    const consulterDemandeComplèteRaccordement =
      consulterDemandeComplèteRaccordementQueryHandlerFactory({
        findDemandeComplèteRaccordement: findProjection,
      });

    await waitForExpect(async () => {
      const actual = consulterDemandeComplèteRaccordement({
        référenceDemandeRaccordement: this.référenceDemandeRaccordement,
      });
    });
  },
);

Alors(
  'la demande est consultable dans la liste des demandes complètes de raccordement du projet',
  function () {},
);
