import { NotFoundError } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  DossierRaccordementReadModel,
  DossierRaccordementReadModelKey,
} from '../raccordement.readModel';
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
import { Find } from '../../common.port';

export type ConsulterDossierRaccordementQuery = Message<
  'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement | RéférenceDossierRaccordement;
  },
  DossierRaccordementReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  find: Find;
};

export const registerConsulterDossierRaccordementQuery = ({
  find,
}: ConsulterDossierRaccordementDependencies) => {
  const queryHandler: MessageHandler<ConsulterDossierRaccordementQuery> = async ({
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
    const key: DossierRaccordementReadModelKey = `dossier-raccordement#${rawIdentifiantProjet}#${rawRéférenceDossierRaccordement}`;
    const result = await find<DossierRaccordementReadModel>(key);

    if (isNone(result)) {
      throw new NotFoundError(`Le dossier de raccordement n'est pas référencé`);
    }

    return result;
  };

  mediator.register('CONSULTER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};
