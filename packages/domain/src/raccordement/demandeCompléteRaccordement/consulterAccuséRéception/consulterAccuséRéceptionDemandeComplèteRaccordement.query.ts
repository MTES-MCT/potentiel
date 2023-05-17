import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Readable } from 'stream';
import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from './accuséRéceptionDemandeComplèteRaccordement.readModel';
import { DossierRaccordementReadModel } from '../../dossierRaccordement/consulter';

const CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT = Symbol(
  'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
);

export type RécupérerAccuséRéceptionDemandeComplèteRaccordementPort = (
  args: ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery['data'] & { format: string },
) => Promise<Readable>;

type ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  find: Find;
  récupérerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = Message<
  typeof CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT,
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
  },
  AccuséRéceptionDemandeComplèteRaccordementReadModel
>;

export const registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = ({
  find,
  récupérerAccuséRéceptionDemandeComplèteRaccordement,
}: ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(dossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const { accuséRéception: { format } = { format: '' } } = dossierRaccordement;

    const content = await récupérerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
    });

    return {
      type: 'accusé-réception-demande-compléte-raccordement',
      format,
      content,
    };
  };
  mediator.register(CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT, handler);
};

export const buildConsulterAccuséRéceptionDemandeComplèteRaccordementQuery =
  getMessageBuilder<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>(
    CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT,
  );
