import { Readable } from 'stream';
import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEvent } from '../raccordement.event';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort } from '../raccordement.ports';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { DossierRaccordement, RéférenceDossierRaccordement } from '../raccordement.valueType';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: RéférenceDossierRaccordement;
    accuséRéception: { format: string; content: Readable };
  }
>;

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export const registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  publish,
  loadAggregate,
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
}: EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordement = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({ identifiantProjet, référenceDossierRaccordement, accuséRéception }) => {
    const raccordement = await loadRaccordement(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const dossier = raccordement.dossiers.get(
      référenceDossierRaccordement.formatter(),
    ) as DossierRaccordement;

    await enregistrerAccuséRéceptionDemandeComplèteRaccordement({
      type: isNone(dossier.demandeComplèteRaccordement.format) ? 'création' : 'modification',
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      accuséRéception,
    });

    const accuséRéceptionTransmis: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        format: accuséRéception.format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmis);
  };

  mediator.register('ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};
