import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Raccordement } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';

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
    const results = await list<Raccordement.DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantProjet: Where.endWith(numéroCRE ? `#${numéroCRE}` : undefined),
        référence: Where.contain(référenceDossierRaccordement),
      },
    });

    return mapToReadModel(results.items);
  };

  mediator.register('Lauréat.Raccordement.Query.RechercherDossierRaccordement', handler);
};

const mapToReadModel = (result: ReadonlyArray<Raccordement.DossierRaccordementEntity>) => {
  return result.map(({ identifiantGestionnaireRéseau, identifiantProjet, référence }) => ({
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
