import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List } from '@potentiel-domain/entity';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { RéférenceRaccordementIdentifiantProjetEntity } from '../raccordement.entity';

export type RechercherDossierRaccordementReadModel = ReadonlyArray<{
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
}>;

export type RechercherDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.RechercherDossierRaccordement',
  {
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
    référenceDossierRaccordement,
  }) => {
    const results = await list<RéférenceRaccordementIdentifiantProjetEntity>(
      'référence-raccordement-projet',
      {
        where: {
          référence: {
            operator: 'like',
            value: `%${référenceDossierRaccordement}%`,
          },
        },
      },
    );

    return mapToReadModel(results.items);
  };

  mediator.register('Réseau.Raccordement.Query.RechercherDossierRaccordement', handler);
};

const mapToReadModel = (result: ReadonlyArray<RéférenceRaccordementIdentifiantProjetEntity>) => {
  return result.map(({ identifiantProjet, référence }) => ({
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
