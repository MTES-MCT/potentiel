import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Readable } from 'stream';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from './accuséRéceptionDemandeComplèteRaccordement.readModel';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type RécupérerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable>;

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  récupérerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = Message<
  'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    format: string;
  },
  AccuséRéceptionDemandeComplèteRaccordementReadModel
>;

export const registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = ({
  récupérerAccuséRéceptionDemandeComplèteRaccordement,
}: ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    format,
  }) => {
    const content = await récupérerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      référenceDossierRaccordement,
      format,
    });

    return {
      type: 'accusé-réception-demande-compléte-raccordement',
      format,
      content,
    } satisfies AccuséRéceptionDemandeComplèteRaccordementReadModel;
  };
  mediator.register('CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT', handler);
};

export const buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery =
  getMessageBuilder<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>(
    'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
  );
