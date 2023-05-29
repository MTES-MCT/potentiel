import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { LoadAggregate } from '@potentiel/core-domain';
import { loadRaccordementAggregateFactory } from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type RenommerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'RENOMMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    ancienneRéférenceDossierRaccordement: string;
    nouvelleRéférenceDossierRaccordement: string;
    accuséRéception: { format: string };
  }
>;

export type RenommerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  ancienneRéférenceDossierRaccordement: string;
  nouvelleRéférenceDossierRaccordement: string;
  format: string;
}) => Promise<void>;

export type RenommerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  loadAggregate: LoadAggregate;
  renommerAccuséRéceptionDemandeComplèteRaccordement: RenommerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerRenommerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  loadAggregate,
  renommerAccuséRéceptionDemandeComplèteRaccordement,
}: RenommerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    RenommerAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({
    identifiantProjet,
    ancienneRéférenceDossierRaccordement,
    nouvelleRéférenceDossierRaccordement,
    accuséRéception: { format },
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (
      isNone(raccordement) ||
      !raccordement.références.includes(ancienneRéférenceDossierRaccordement)
    ) {
      throw new DossierRaccordementNonRéférencéError();
    }

    await renommerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      ancienneRéférenceDossierRaccordement,
      nouvelleRéférenceDossierRaccordement,
      format,
    });
  };

  mediator.register('RENOMMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildRenommerAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<RenommerAccuséRéceptionDemandeComplèteRaccordementCommand>(
    'RENOMMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
