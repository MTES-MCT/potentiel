import { Message, MessageHandler, mediator } from 'mediateur';
import {
  DossierRaccordementReadModel,
  RésultatRechercheDossierRaccordementReadModel,
} from '../raccordement.readModel';
import {
  RawIdentifiantProjet,
  RéférenceDossierRaccordementValueType,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { Search } from '../../common.port';

export type RechercherDossierRaccordementQuery = Message<
  'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
  {
    référence: RéférenceDossierRaccordementValueType;
  },
  ReadonlyArray<RésultatRechercheDossierRaccordementReadModel>
>;

export type RechercherDossierRaccordementDependencies = {
  search: Search;
};

export const registerRechercherDossierRaccordementQuery = ({
  search,
}: RechercherDossierRaccordementDependencies) => {
  const queryHandler: MessageHandler<RechercherDossierRaccordementQuery> = async ({
    référence,
  }) => {
    const result = await search<DossierRaccordementReadModel>(
      `dossier-raccordement#%#%${référence}%`,
    );

    return result.map(({ key, readModel }) => {
      const identifiantProjet = convertirEnIdentifiantProjet(key as RawIdentifiantProjet);

      return {
        type: 'résultat-recherche-dossier-raccordement',
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: readModel.référence,
      };
    });
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};
