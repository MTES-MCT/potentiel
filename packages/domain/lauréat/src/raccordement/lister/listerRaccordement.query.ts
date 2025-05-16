import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Raccordement } from '@potentiel-domain/projet';

export type RaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
};

export type ListerRaccordementReadModel = {
  items: ReadonlyArray<RaccordementReadModel>;
  total: number;
};

export type ListerRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ListerRaccordement',
  {
    identifiantGestionnaireRéseauValue?: string;
  },
  ListerRaccordementReadModel
>;

export type ListerRaccordementQueryDependencies = {
  list: List;
};

export const registerListerRaccordementQuery = ({ list }: ListerRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerRaccordementQuery> = async ({
    identifiantGestionnaireRéseauValue,
  }) => {
    const { items, total } = await list<Raccordement.RaccordementEntity>('raccordement', {
      orderBy: {
        identifiantProjet: 'ascending',
      },
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseauValue),
      },
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      total,
    };
  };
  mediator.register('Lauréat.Raccordement.Query.ListerRaccordement', handler);
};

const mapToReadModel = (raccordement: Raccordement.RaccordementEntity): RaccordementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(raccordement.identifiantProjet),
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        raccordement.identifiantGestionnaireRéseau,
      ),
  };
};
