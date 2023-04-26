import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { CommandHandlerFactory, DomainEvent, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  IdentifiantProjet,
  TransmettreDemandeComplèteRaccordementCommand,
  createRaccordementAggregateId,
  formatIdentifiantProjet,
  loadRaccordementAggregateFactory,
} from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';

type ModifierDemandeComplèteRaccordementCommand = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  référenceDossierRaccordement: string;
};

type ModifierDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

const modifierDemandeComplèteRaccordementCommandHandlerFactory: CommandHandlerFactory<
  TransmettreDemandeComplèteRaccordementCommand,
  ModifierDemandeComplèteRaccordementDependencies
> =
  ({ publish, loadAggregate }) =>
  async ({ identifiantProjet, dateQualification, référenceDossierRaccordement }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement)) {
      // throw err
      return;
    }

    type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
      'DemandeComplèteRaccordementModifiée',
      {
        identifiantProjet: string;
        dateQualification: string;
        référenceDossierRaccordement: string;
      }
    >;

    const event: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateQualification: dateQualification.toISOString(),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };

const modifierDemandeComplèteRaccordement =
  modifierDemandeComplèteRaccordementCommandHandlerFactory({
    loadAggregate,
    publish,
  });

Quand(`le porteur modifie la date de qualification`, async function (this: PotentielWorld) {
  try {
    await modifierDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      dateQualification: new Date('2023-04-26'),
    });
  } catch (error) {
    if (error instanceof DossierRaccordementNonRéférencéError) {
      this.error = error;
    }
  }
});
