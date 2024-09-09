import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantPériode, PériodeEntity } from '../période';
import { ConsulterPériodeReadModel, mapToReadModel } from '../consulter/consulterPériode.query';

export type ListerPériodeItemReadModel = ConsulterPériodeReadModel;

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
  }) => {
    const notifiées = await list<PériodeEntity>(`période`, {
      range,
      where: {
        appelOffre: Where.equal(appelOffre),
      },
    });

    if (estNotifiée === true) {
      return {
        items: notifiées.items.map(mapToReadModel),
        range: notifiées.range,
        total: notifiées.total,
      };
    }

    if (estNotifiée === false) {
      const appelOffres = await list<AppelOffre.AppelOffreEntity>(`appel-offre`, {
        where: { id: Where.equal(appelOffre) },
      });

      const all = appelOffres.items.reduce((acc, current) => {
        const periodes: Array<ConsulterPériodeReadModel> = current.periodes.map((periode) => ({
          identifiantPériode: IdentifiantPériode.convertirEnValueType(
            `${current.id}#${periode.id}`,
          ),
          estNotifiée: false,
        }));

        return [...acc, ...periodes];
      }, [] as Array<ConsulterPériodeReadModel>);

      const allWithoutNotifiées = all.filter(
        (période) =>
          notifiées.items.find(
            (notifiée) => notifiée.identifiantPériode === période.identifiantPériode.formatter(),
          ) === undefined,
      );

      const itemsRanged = range
        ? allWithoutNotifiées.slice(range.startPosition, range.endPosition)
        : allWithoutNotifiées;

      return {
        items: itemsRanged,
        range: range ?? { startPosition: 0, endPosition: itemsRanged.length - 1 },
        total: itemsRanged.length,
      };
    }

    const appelOffres = await list<AppelOffre.AppelOffreEntity>(`appel-offre`, {
      where: { id: Where.equal(appelOffre) },
    });

    const items = appelOffres.items.reduce((acc, current) => {
      const periodes: Array<ConsulterPériodeReadModel> = current.periodes.map((periode) => {
        const identifiantPériode = IdentifiantPériode.convertirEnValueType(
          `${current.id}#${periode.id}`,
        );

        const notifiée = notifiées.items.find(
          (notifiée) => notifiée.identifiantPériode === identifiantPériode.formatter(),
        );

        return {
          identifiantPériode,
          ...(notifiée?.estNotifiée
            ? {
                estNotifiée: true,
                identifiantLauréats: notifiée.identifiantLauréats.map(
                  IdentifiantProjet.convertirEnValueType,
                ),
                identifiantÉliminés: notifiée.identifiantÉliminés.map(
                  IdentifiantProjet.convertirEnValueType,
                ),
                notifiéeLe: DateTime.convertirEnValueType(notifiée.notifiéeLe),
                notifiéePar: Email.convertirEnValueType(notifiée.notifiéePar),
              }
            : { estNotifiée: false }),
        };
      });

      return [...acc, ...periodes];
    }, [] as Array<ConsulterPériodeReadModel>);

    const itemsRanged = range ? items.slice(range.startPosition, range.endPosition) : items;

    return {
      items: itemsRanged,
      range: range ?? { startPosition: 0, endPosition: itemsRanged.length - 1 },
      total: itemsRanged.length,
    };
  };

  mediator.register('Période.Query.ListerPériodes', handler);
};
