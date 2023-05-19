import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Readable } from 'stream';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from './accuséRéceptionDemandeComplèteRaccordement.readModel';

export const CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT = Symbol(
  'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
);

export type RécupérerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
}) => Promise<Readable>;

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  récupérerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = Message<
  typeof CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
    format: string;
  },
  AccuséRéceptionDemandeComplèteRaccordementReadModel
>;

export const registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = ({
  récupérerAccuséRéceptionDemandeComplèteRaccordement,
}: ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery> = async ({
    identifiantProjet,
    référence,
    format,
  }) => {
    const content = await récupérerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      référence: référence,
      format,
    });

    return {
      type: 'accusé-réception-demande-compléte-raccordement',
      format,
      content,
    } satisfies AccuséRéceptionDemandeComplèteRaccordementReadModel;
  };
  mediator.register(CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT, handler);
};

export const buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery =
  getMessageBuilder<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>(
    CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT,
  );
