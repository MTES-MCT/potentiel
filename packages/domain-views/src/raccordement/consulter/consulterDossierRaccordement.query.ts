import { Message, MessageHandler, mediator } from 'mediateur';
import { Option } from '@potentiel/monads';
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
  Option<DossierRaccordementReadModel>
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

    return result;
  };

  mediator.register('CONSULTER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};
