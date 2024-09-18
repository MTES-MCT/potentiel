import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantPériode, PériodeEntity } from '../période';
import { ConsulterPériodeReadModel } from '../consulter/consulterPériode.query';

export const listerPériodesNonNotifiées = async (
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
    const periodes: Array<ConsulterPériodeReadModel> = current.periodes.map((periode) => ({
      identifiantPériode: IdentifiantPériode.convertirEnValueType(`${current.id}#${periode.id}`),
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

  return {
    items: range
      ? allWithoutNotifiées.slice(range.startPosition, range.endPosition)
      : allWithoutNotifiées,
    range: range ?? { startPosition: 0, endPosition: allWithoutNotifiées.length },
    total: allWithoutNotifiées.length,
  };
};
