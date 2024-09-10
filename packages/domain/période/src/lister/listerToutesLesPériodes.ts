import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantPériode, PériodeEntity } from '../période';
import { ConsulterPériodeReadModel } from '../consulter/consulterPériode.query';

export const listerToutesLesPériodes = async (
  list: List,
  range: RangeOptions | undefined,
  appelOffre: string | undefined,
) => {
  const notifiées = await list<PériodeEntity>(`période`, {
    range,
    where: {
      appelOffre: Where.equal(appelOffre),
    },
  });

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
