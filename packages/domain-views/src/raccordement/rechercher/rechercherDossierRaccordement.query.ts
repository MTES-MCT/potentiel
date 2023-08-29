import { Message, MessageHandler, mediator } from 'mediateur';
import {
  DossierRaccordementReadModel,
  RésultatRechercheDossierRaccordementReadModel,
} from '../raccordement.readModel';
import {
  RawIdentifiantProjet,
  RawRéférenceDossierRaccordement,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { Search } from '@potentiel/core-domain';

export type RechercherDossierRaccordementQuery = Message<
  'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
  {
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
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
    référenceDossierRaccordement,
  }) => {
    const result = await search<DossierRaccordementReadModel>(
      `dossier-raccordement|%#%${référenceDossierRaccordement}%`,
    );

    return result.map(({ key, readModel }) => {
      const référenceDossierRaccordement = readModel.référence;

      const identifiantProjet = convertirEnIdentifiantProjet(
        key
          .replace('dossier-raccordement|', '')
          .replace(`#${référenceDossierRaccordement}`, '') as RawIdentifiantProjet,
      );

      return {
        type: 'résultat-recherche-dossier-raccordement',
        identifiantProjet: identifiantProjet.formatter(),
        référenceDossierRaccordement: readModel.référence,
      };
    });
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};
