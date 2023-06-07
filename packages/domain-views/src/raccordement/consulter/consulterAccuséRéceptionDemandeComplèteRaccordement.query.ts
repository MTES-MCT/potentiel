import { IdentifiantProjet } from '@potentiel/domain';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Readable } from 'stream';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from '../raccordement.readModel';

export type RécupérerAccuséRéceptionDemandeComplèteRaccordementPort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable | undefined>;

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
  AccuséRéceptionDemandeComplèteRaccordementReadModel | undefined
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
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossierRaccordement,
      format,
    });

    if (!content) {
      return undefined;
    }

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
