import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire, Lauréat, Puissance, ReprésentantLégal } from '@potentiel-domain/laureat';

type Props = {
  identifiantProjet: string;
};

export type GetLauréat = {
  actionnaire: Actionnaire.ConsulterActionnaireReadModel;
  représentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Puissance.ConsulterPuissanceReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
};

export const getLauréat = cache(async ({ identifiantProjet }: Props): Promise<GetLauréat> => {
  const lauréat = await getLauréatInfos({ identifiantProjet });
  const actionnaireInfos = await getActionnaireInfos({ identifiantProjet });
  const représentantLégalInfos = await getReprésentantLégalInfos({ identifiantProjet });
  const puissanceInfos = await getPuissanceInfos({ identifiantProjet });

  return {
    actionnaire: actionnaireInfos,
    représentantLégal: représentantLégalInfos,
    puissance: puissanceInfos,
    lauréat,
  };
});

export const getLauréatInfos = async ({ identifiantProjet }: Props) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(lauréat)) {
    return notFound();
  }

  return lauréat;
};

const getActionnaireInfos = async ({ identifiantProjet }: Props) => {
  const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(actionnaire)) {
    return notFound();
  }

  return actionnaire;
};

export const getReprésentantLégalInfos = async ({ identifiantProjet }: Props) => {
  const représentantLégal = await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(représentantLégal)) {
    return notFound();
  }

  return représentantLégal;
};

const getPuissanceInfos = async ({ identifiantProjet }: Props) => {
  const puissance = await mediator.send<Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(puissance)) {
    return notFound();
  }

  return puissance;
};
