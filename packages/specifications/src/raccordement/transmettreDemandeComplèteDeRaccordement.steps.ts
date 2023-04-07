import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  CommandHandlerFactory,
  Create,
  DomainEvent,
  DomainEventHandlerFactory,
  Find,
  Publish,
  QueryHandlerFactory,
  ReadModel,
  Unsubscribe,
} from '@potentiel/core-domain';
import {
  GestionnaireRéseauReadModel,
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '@potentiel/domain';
import { createProjection, findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { isNone, isSome } from '@potentiel/monads';
import { PotentielWorld } from '../potentiel.world';

let unsubscribe: Unsubscribe;

type DemandeComplèteRaccordementReadModel = ReadModel<
  'demande-complète-raccordement',
  {
    référenceDemandeRaccordement: string;
    gestionnaireRéseau: GestionnaireRéseauReadModel;
    dateQualification: string;
  }
>;

EtantDonné('un projet', function (this: PotentielWorld) {
  this.raccordementWorld.identifiantProjet = {
    appelOffre: 'PPE2 - Eolien',
    période: '1',
    numéroCRE: '23',
  };
});

Quand(
  `le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDemandeRaccordement =
      exemple['La référence de la demande de raccordement'];

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
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
    };

    type TransmettreDemandeComplèteRaccordementDependencies = {
      publish: Publish;
    };

    type DemandeComplèteDeRaccordementTransmiseEvent = DomainEvent<
      'DemandeComplèteDeRaccordementTransmise',
      {
        identifiantProjet: string;
        identifiantGestionnaireRéseau: string;
        dateQualification: string;
        référenceDemandeRaccordement: string;
      }
    >;

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

    const demandeComplèteDeRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
      DemandeComplèteDeRaccordementTransmiseEvent,
      {
        create: Create<DemandeComplèteRaccordementReadModel>;
        find: Find<GestionnaireRéseauReadModel>;
      }
    > =
      ({ create, find }) =>
      async (event) => {
        const gestionnaireRéseau = await find(
          `gestionnaire-réseau#${event.payload.identifiantGestionnaireRéseau}`,
        );

        if (isSome(gestionnaireRéseau)) {
          await create(
            `demande-complète-raccordement#${event.payload.référenceDemandeRaccordement}`,
            {
              dateQualification: event.payload.dateQualification,
              référenceDemandeRaccordement: event.payload.référenceDemandeRaccordement,
              gestionnaireRéseau,
            },
          );
        } else {
          // TODO: logguer au cas où
        }
      };

    const demandeComplèteDeRaccordementTransmiseHandler =
      demandeComplèteDeRaccordementTransmiseHandlerFactory({
        create: createProjection,
        find: findProjection,
      });

    unsubscribe = await subscribe(
      'DemandeComplèteDeRaccordementTransmise',
      demandeComplèteDeRaccordementTransmiseHandler,
    );

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        publish,
      });

    await transmettreDemandeComplèteRaccordement(command);
  },
);

Alors(
  'le projet devrait avoir une demande complète de raccordement pour ce gestionnaire de réseau',
  async function async(this: PotentielWorld) {
    type ConsulterDemandeComplèteRaccordementQuery = { référenceDemandeRaccordement: string };

    type ConsulterDemandeComplèteRaccordementDependencies = {
      find: Find<DemandeComplèteRaccordementReadModel>;
    };

    const consulterDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
      ConsulterDemandeComplèteRaccordementQuery,
      DemandeComplèteRaccordementReadModel,
      ConsulterDemandeComplèteRaccordementDependencies
    > =
      ({ find }) =>
      async ({ référenceDemandeRaccordement }) => {
        const result = await find(`demande-complète-raccordement#${référenceDemandeRaccordement}`);
        if (isNone(result)) {
          throw new Error('Not implemented');
        }
        return result;
      };

    const consulterDemandeComplèteRaccordement =
      consulterDemandeComplèteRaccordementQueryHandlerFactory({
        find: findProjection,
      });

    await waitForExpect(async () => {
      const actual = await consulterDemandeComplèteRaccordement({
        référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
      });

      actual.should.be.deep.equal({
        référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
        gestionnaireRéseau: this.raccordementWorld.enedis,
        dateQualification: this.raccordementWorld.dateQualification,
      });
    });

    unsubscribe && (await unsubscribe());
  },
);

Alors(
  'la demande est consultable dans la liste des demandes complètes de raccordement du projet',
  async function async(this: PotentielWorld) {
    type ListerDemandeComplèteRaccordementQuery = { identifiantProjet: IdentifiantProjet };

    type ListeDemandeComplèteRaccordementReadModel = ReadModel<
      'liste-demande-complète-raccordement',
      {
        gestionnaireRéseau: GestionnaireRéseauReadModel;
        référencesDemandeRaccordement: string[];
      }
    >;

    type ListerDemandeComplèteRaccordementDependencies = {
      find: Find<ListeDemandeComplèteRaccordementReadModel>;
    };

    const listerDemandeComplèteRaccordementQueryHandlerFactory: QueryHandlerFactory<
      ListerDemandeComplèteRaccordementQuery,
      ListeDemandeComplèteRaccordementReadModel,
      ListerDemandeComplèteRaccordementDependencies
    > =
      ({ find }) =>
      async ({ identifiantProjet }) => {
        const result = await find(
          `liste-demande-complète-raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
        );
        if (isNone(result)) {
          throw new Error('Not implemented');
        }
        return result;
      };

    const listerDemandeComplèteRaccordement = listerDemandeComplèteRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await listerDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      });
      actual.gestionnaireRéseau.should.be.deep.equal(this.raccordementWorld.enedis);
      actual.référencesDemandeRaccordement.should.contain(
        this.raccordementWorld.référenceDemandeRaccordement,
      );
    });

    unsubscribe && (await unsubscribe());
  },
);
