import { Search } from '@potentiel/core-domain';
import { RésultatRechercheDossierRaccordementReadModel } from './résultatRechercheDossierRaccordement.readModel';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { DossierRaccordementReadModel } from '../consulter/dossierRaccordement.readModel';
import { IdentifiantProjet } from '../../../projet/valueType/identifiantProjet';

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

    return result.map(({ key, readModel }) => {
      const parsedKey = key.split('#');

      const identifiantProjet: IdentifiantProjet = {
        appelOffre: parsedKey[1],
        période: parsedKey[2],
        famille: parsedKey[3],
        numéroCRE: parsedKey[4],
      };

      return {
        type: 'résultat-recherche-dossier-raccordement',
        identifiantProjet,
        référenceDossier: readModel.référence,
      };
    });
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};

export const buildRechercherDossierRaccordementQuery =
  getMessageBuilder<RechercherDossierRaccordementQuery>('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY');
