import { Search } from '@potentiel/core-domain';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  DossierRaccordementReadModel,
  RésultatRechercheDossierRaccordementReadModel,
} from '../raccordement.readModel';
import { IdentifiantProjet } from '@potentiel/domain/dist/projet/valueType/identifiantProjet';

export type RechercherDossierRaccordementQuery = Message<
  'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
  {
    référence: string;
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

    return result.map(({ key }) => {
      const [appelOffre, période, famille, numéroCRE] = key.split('#');

      const identifiantProjet: IdentifiantProjet = {
        appelOffre,
        période,
        famille,
        numéroCRE,
      };

      return {
        type: 'résultat-recherche-dossier-raccordement',
        identifiantProjet,
      };
    });
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};

export const buildRechercherDossierRaccordementQuery =
  getMessageBuilder<RechercherDossierRaccordementQuery>('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY');
