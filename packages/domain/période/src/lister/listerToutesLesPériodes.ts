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
    where: {
      appelOffre: Where.equal(appelOffre),
    },
  });

  const appelOffres = await list<AppelOffre.AppelOffreEntity>(`appel-offre`, {
    where: { id: Where.equal(appelOffre) },
  });

  const all = appelOffres.items.reduce((acc, current) => {
    const periodes: Array<ConsulterPériodeReadModel> = current.periodes.map((periode) => {
      const identifiantPériode = IdentifiantPériode.convertirEnValueType(
        `${current.id}#${periode.id}`,
      );

      const périodeNotifiée = notifiées.items.find(
        (notifiée) => notifiée.identifiantPériode === identifiantPériode.formatter(),
      );

      if (périodeNotifiée?.estNotifiée) {
        return {
          identifiantPériode,
          estNotifiée: true,
          identifiantLauréats: périodeNotifiée.identifiantLauréats.map(
            IdentifiantProjet.convertirEnValueType,
          ),
          identifiantÉliminés: périodeNotifiée.identifiantÉliminés.map(
            IdentifiantProjet.convertirEnValueType,
          ),
          notifiéeLe: DateTime.convertirEnValueType(périodeNotifiée.notifiéeLe),
          notifiéePar: Email.convertirEnValueType(périodeNotifiée.notifiéePar),
        };
      }

      return {
        identifiantPériode,
        estNotifiée: false,
      };
    });

    return [...acc, ...periodes];
  }, [] as Array<ConsulterPériodeReadModel>);

  return {
    items: range ? all.slice(range.startPosition, range.endPosition + 1) : all,
    range: range ?? { startPosition: 0, endPosition: all.length },
    total: all.length,
  };
};
