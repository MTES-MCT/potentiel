import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import { PériodeEntity } from '../période.entity';
import { IdentifiantPériode } from '../période';
import { Période } from '..';

type CommonPériode = {
  identifiantPériode: IdentifiantPériode.ValueType;
  typeImport: AppelOffre.Periode['typeImport'];
};

type PériodeNonNotifiée = {
  estNotifiée: false;
};

type PériodeNotifiée = {
  estNotifiée: true;

  notifiéeLe?: DateTime.ValueType;
  notifiéePar?: Email.ValueType;
};

export type ListerPériodeItemReadModel = CommonPériode & (PériodeNotifiée | PériodeNonNotifiée);

export type ListerPériodesReadModel = {
  items: ReadonlyArray<ListerPériodeItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerPériodesQuery = Message<
  'Période.Query.ListerPériodes',
  {
    appelOffre?: string;
    estNotifiée?: boolean;
    range?: RangeOptions;
    identifiantsPériodes?: Array<IdentifiantPériode.RawType>;
  },
  ListerPériodesReadModel
>;

export type ListerPériodesDependencies = {
  list: List;
};

export const registerListerPériodesQuery = ({ list }: ListerPériodesDependencies) => {
  const handler: MessageHandler<ListerPériodesQuery> = async ({
    range,
    estNotifiée,
    appelOffre,
    identifiantsPériodes,
  }) => {
    const notifiées = await list<PériodeEntity, AppelOffre.AppelOffreEntity>(`période`, {
      range,
      join: {
        entity: 'appel-offre',
        on: 'appelOffre',
      },
      where: {
        identifiantPériode: Where.matchAny(identifiantsPériodes),
        appelOffre: Where.equal(appelOffre),
        estNotifiée: Where.equal(estNotifiée),
      },
      orderBy: {
        notifiéeLe: 'descending',
      },
    });

    return {
      items: notifiées.items.map(mapToReadModel),
      range: notifiées.range,
      total: notifiées.total,
    };
  };

  mediator.register('Période.Query.ListerPériodes', handler);
};

const mapToReadModel = (
  période: PériodeEntity & Joined<AppelOffre.AppelOffreEntity>,
): ListerPériodeItemReadModel => {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    période.identifiantPériode,
  );

  const typeImport =
    période['appel-offre'].periodes.find((p) => p.id === identifiantPériode.période)?.typeImport ??
    'csv';

  if (période.estNotifiée && période.notifiéeLe && période.notifiéePar) {
    return {
      identifiantPériode,
      estNotifiée: true,
      typeImport,
      notifiéeLe: DateTime.convertirEnValueType(période.notifiéeLe),
      notifiéePar: Email.convertirEnValueType(période.notifiéePar),
    };
  }

  return {
    identifiantPériode,
    estNotifiée: false,
    typeImport,
  };
};
