import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List, Where } from '@potentiel-domain/entity';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DossierRaccordementEntity } from '../raccordement.entity';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type RechercherDossierRaccordementReadModel = ReadonlyArray<{
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
}>;

export type RechercherDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.RechercherDossierRaccordement',
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
    const results = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantProjet: Where.endWith(numéroCRE ? `#${numéroCRE}` : undefined),
        référence: Where.contains(référenceDossierRaccordement),
      },
    });

    return mapToReadModel(results.items);
  };

  mediator.register('Réseau.Raccordement.Query.RechercherDossierRaccordement', handler);
};

const mapToReadModel = (result: ReadonlyArray<DossierRaccordementEntity>) => {
  return result.map(({ identifiantGestionnaireRéseau, identifiantProjet, référence }) => ({
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
