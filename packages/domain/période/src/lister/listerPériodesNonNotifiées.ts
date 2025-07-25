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

  const aosActif =
    process.env.FEATURES?.split(',')
      .map((s) => s.trim())
      .includes('aos') ?? false;

  const appelOffres = await list<AppelOffre.AppelOffreEntity>(`appel-offre`, {
    where: {
      id: appelOffre
        ? Where.equal(appelOffre)
        : aosActif
          ? undefined
          : Where.notEqual('PPE2 - Petit PV Bâtiment'),
    },
  });

  const all = appelOffres.items.reduce((acc, current) => {
    const periodes: Array<ConsulterPériodeReadModel> = current.periodes.map((periode) => ({
      identifiantPériode: IdentifiantPériode.convertirEnValueType(`${current.id}#${periode.id}`),
      estNotifiée: false,
    }));

    return [...acc, ...periodes];
  }, [] as Array<ConsulterPériodeReadModel>);

  const allWithoutNotifiées = all
    .filter(
      (période) =>
        notifiées.items.find(
          (notifiée) => notifiée.identifiantPériode === période.identifiantPériode.formatter(),
        ) === undefined,
    )
    .sort((a, b) => a.identifiantPériode.appelOffre.localeCompare(b.identifiantPériode.appelOffre));

  return {
    items: range
      ? allWithoutNotifiées.slice(range.startPosition, range.endPosition + 1)
      : allWithoutNotifiées,
    range: range ?? { startPosition: 0, endPosition: allWithoutNotifiées.length },
    total: allWithoutNotifiées.length,
  };
};
