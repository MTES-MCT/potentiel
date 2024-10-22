import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { DossierRaccordementEntity } from '../raccordement.entity';
import { RéférenceDossierRaccordement } from '..';

type DossierRaccordementEnAttenteMiseEnService = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  commune: string;
  codePostal: string;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  statutDGEC: string;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceReadModel = {
  items: Array<DossierRaccordementEnAttenteMiseEnService>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceQuery = Message<
  'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
  {
    identifiantGestionnaireRéseau: string;
    range?: RangeOptions;
  },
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  list: List;
};

export const registerListerDossierRaccordementEnAttenteMiseEnServiceQuery = ({
  list,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementEnAttenteMiseEnServiceQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        miseEnService: {
          dateMiseEnService: Where.equalNull(),
        },
      },
      orderBy: {
        référence: 'ascending',
      },
    });
    return {
      items: items.map(toReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register(
    'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
    handler,
  );
};

export const toReadModel = ({
  identifiantProjet,
  référence,
}: DossierRaccordementEntity): DossierRaccordementEnAttenteMiseEnService => {
  return {
    appelOffre: '',
    codePostal: '',
    commune: '',
    famille: '',
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet: '',
    numeroCRE: '',
    periode: '',
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: '',
  };
};
