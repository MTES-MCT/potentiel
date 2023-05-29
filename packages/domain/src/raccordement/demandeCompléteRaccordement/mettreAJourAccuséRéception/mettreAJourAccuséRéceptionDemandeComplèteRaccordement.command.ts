import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { LoadAggregate } from '@potentiel/core-domain';
import { loadRaccordementAggregateFactory } from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { Readable } from 'stream';

export type MettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'METTRE_A_JOUR_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    accuséRéception: { format: string; content: Readable };
  }
>;

export type MettreAJourAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
  content: Readable;
}) => Promise<void>;

export type MettreAJourAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  loadAggregate: LoadAggregate;
  mettreAJourAccuséRéceptionDemandeComplèteRaccordement: MettreAJourAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerMettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  loadAggregate,
  mettreAJourAccuséRéceptionDemandeComplèteRaccordement,
}: MettreAJourAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    MettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    accuséRéception: { format, content },
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    await mettreAJourAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      content,
      format,
      référenceDossierRaccordement,
    });
  };

  mediator.register(
    'METTRE_A_JOUR_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
    handler,
  );
};

export const buildMettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<MettreAJourAccuséRéceptionDemandeComplèteRaccordementCommand>(
    'METTRE_A_JOUR_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
