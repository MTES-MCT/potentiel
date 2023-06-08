import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  DossierRaccordementReadModel,
  RésultatRechercheDossierRaccordementReadModel,
} from '../raccordement.readModel';
import {
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

    return result.map(({ key }) => {
      const identifiantProjet = convertirEnIdentifiantProjet(key);

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
