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
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option, isNone, none } from '@potentiel/monads';
import {
  LegacyDossierRaccordementReadModel,
  DossierRaccordementReadModelKey,
  AccuséRéceptionDemandeComplèteRaccordementReadModel,
} from '../raccordement.readModel';
import { RécupérerAccuséRéceptionDemandeComplèteRaccordementPort } from '../raccordement.ports';
import { Find } from '../../common.port';

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  find: Find;
  récupérerAccuséRéceptionDemandeComplèteRaccordement: RécupérerAccuséRéceptionDemandeComplèteRaccordementPort;
};

export type ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = Message<
  'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement | RéférenceDossierRaccordement;
  },
  Option<AccuséRéceptionDemandeComplèteRaccordementReadModel>
>;

export const registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery = ({
  find,
  récupérerAccuséRéceptionDemandeComplèteRaccordement,
}: ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;
    const rawRéférenceDossierRaccordement = estUneRéférenceDossierRaccordement(
      référenceDossierRaccordement,
    )
      ? convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement).formatter()
      : référenceDossierRaccordement;

    const key: DossierRaccordementReadModelKey = `dossier-raccordement|${rawIdentifiantProjet}#${rawRéférenceDossierRaccordement}`;

    const dossierRaccordement = await find<LegacyDossierRaccordementReadModel>(key);

    if (
      isNone(dossierRaccordement) ||
      !dossierRaccordement.accuséRéception ||
      !dossierRaccordement.accuséRéception.format
    ) {
      return none;
    }

    const content = await récupérerAccuséRéceptionDemandeComplèteRaccordement({
      type: 'demande-complete-raccordement',
      identifiantProjet: rawIdentifiantProjet,
      référenceDossierRaccordement: rawRéférenceDossierRaccordement,
      format: dossierRaccordement.accuséRéception.format,
    });

    if (!content) {
      return none;
    }

    return {
      type: 'accusé-réception-demande-compléte-raccordement',
      format: dossierRaccordement.accuséRéception.format,
      content,
    } satisfies AccuséRéceptionDemandeComplèteRaccordementReadModel;
  };
  mediator.register('CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT', handler);
};
