import { Message, MessageHandler, mediator } from 'mediateur';

import { List, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { IdentifiantProjet, Lauréat } from '../../..';

export type RechercherDossierRaccordementReadModel = ReadonlyArray<{
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
}>;

export type RechercherDossierRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.RechercherDossierRaccordement',
  {
    numéroCRE?: string;
    référenceDossierRaccordement: string;
  },
  RechercherDossierRaccordementReadModel
>;

export type RechercherDossierRaccordementDependencies = {
  list: List;
};

export const registerRechercherDossierRaccordementQuery = ({
  list,
}: RechercherDossierRaccordementDependencies) => {
  const handler: MessageHandler<RechercherDossierRaccordementQuery> = async ({
    numéroCRE,
    référenceDossierRaccordement,
  }) => {
    const results = await list<Lauréat.Raccordement.DossierRaccordementEntity>(
      'dossier-raccordement',
      {
        where: {
          identifiantProjet: Where.endWith(numéroCRE ? `#${numéroCRE}` : undefined),
          référence: Where.like(référenceDossierRaccordement),
        },
      },
    );

    return mapToReadModel(results.items);
  };

  mediator.register('Lauréat.Raccordement.Query.RechercherDossierRaccordement', handler);
};

const mapToReadModel = (result: ReadonlyArray<Lauréat.Raccordement.DossierRaccordementEntity>) => {
  return result.map(({ identifiantGestionnaireRéseau, identifiantProjet, référence }) => ({
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
