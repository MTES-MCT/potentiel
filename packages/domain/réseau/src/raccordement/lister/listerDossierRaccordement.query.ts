import { IdentifiantProjet } from '@potentiel-domain/common';
import { ListV2 } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DossierRaccordementEntity,
  RaccordementEntity
} from '..';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type DossierRaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
};

export type ListerDossierRaccordementReadModel = {
  items: ReadonlyArray<DossierRaccordementReadModel>;
  total: number;
};

export type ListerDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ListerDossierRaccordement',
 where?: WhereOptions<DossierRaccordementEntity>,
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementQueryDependencies = {
  listV2: ListV2;
};

export const registerListerDossierRaccordementQuery = ({
  listV2,
}: ListerDossierRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementQuery> = async ({where}) => {
    const { items, total } = await listV2<RaccordementEntity>('raccordement', {
      orderBy: {
        identifiantProjet: 'ascending',
      },
      where,
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      total,
    };
  };
  mediator.register('Réseau.Raccordement.Query.ListerDossierRaccordement', handler);
};

const mapToReadModel = (
  raccordement: RaccordementEntity,
): DossierRaccordementReadModel => {
  return ({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(raccordement.identifiantProjet),
      identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(raccordement.identifiantGestionnaireRéseau)
  });
};
