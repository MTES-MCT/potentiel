import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 } from '../raccordement.event';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementPort } from '../raccordement.ports';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import {
  AccuséRéceptionDemandeComplèteRaccordement,
  DossierRaccordement,
  RéférenceDossierRaccordementValueType,
} from '../raccordement.valueType';

export type EnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
    accuséRéception: AccuséRéceptionDemandeComplèteRaccordement;
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
      opération: isNone(dossier.demandeComplèteRaccordement.format) ? 'création' : 'modification',
      type: 'demande-complete-raccordement',
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
      accuséRéception,
    });

    const accuséRéceptionTransmis: AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        format: accuséRéception.format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionTransmis);
  };

  mediator.register('ENREGISTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};
