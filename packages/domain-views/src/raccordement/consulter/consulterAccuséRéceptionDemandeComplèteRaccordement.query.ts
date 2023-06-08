import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  RawRéférenceDossierRaccordement,
  RéférenceDossierRaccordement,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnIdentifiantProjet,
  estUneRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { AccuséRéceptionDemandeComplèteRaccordementReadModel } from '../raccordement.readModel';
import { RécupérerAccuséRéceptionDemandeComplèteRaccordementPort } from '../raccordement.ports';

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  récupérerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = Message<
  'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement | RéférenceDossierRaccordement;
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
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;
    const rawRéférenceDossierRaccordement = estUneRéférenceDossierRaccordement(
      référenceDossierRaccordement,
    )
      ? convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement).formatter()
      : référenceDossierRaccordement;
    const content = await récupérerAccuséRéceptionDemandeComplèteRaccordement({
      type: 'demande-complete-raccordement',
      identifiantProjet: rawIdentifiantProjet,
      référenceDossierRaccordement: rawRéférenceDossierRaccordement,
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
