import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire, ReprésentantLégal } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { getLogger, Logger } from '@potentiel-libraries/monitoring';

type Props = {
  identifiantProjet: string;
  logger: Logger;
};

export type GetLauréat = {
  actionnaire: Actionnaire.ConsulterActionnaireReadModel;
  représentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Lauréat.Puissance.ConsulterPuissanceReadModel;
  producteur: Lauréat.Producteur.ConsulterProducteurReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
};

export const getLauréat = cache(async ({ identifiantProjet }: Props): Promise<GetLauréat> => {
  const logger = getLogger('getLauréat');

  const lauréat = await getLauréatInfos({ identifiantProjet, logger });
  const actionnaireInfos = await getActionnaireInfos({ identifiantProjet, logger });
  const représentantLégalInfos = await getReprésentantLégalInfos({ identifiantProjet, logger });
  const puissanceInfos = await getPuissanceInfos({ identifiantProjet, logger });
  const producteurInfos = await getProducteurInfos({ identifiantProjet, logger });

  return {
    actionnaire: actionnaireInfos,
    représentantLégal: représentantLégalInfos,
    puissance: puissanceInfos,
    producteur: producteurInfos,
    lauréat,
  };
});

export const getLauréatInfos = async ({ identifiantProjet, logger }: Props) => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(lauréat)) {
    logger.warn('Projet lauréat non trouvé', { identifiantProjet });
    return notFound();
  }

  return lauréat;
};

const getActionnaireInfos = async ({ identifiantProjet, logger }: Props) => {
  const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(actionnaire)) {
    logger.warn(`Actionnaire non trouvé pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return actionnaire;
};

export const getReprésentantLégalInfos = async ({ identifiantProjet, logger }: Props) => {
  const représentantLégal = await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(représentantLégal)) {
    logger.warn(`Représentant légal non trouvé pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return représentantLégal;
};

const getPuissanceInfos = async ({ identifiantProjet, logger }: Props) => {
  const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(puissance)) {
    logger.warn(`Puissance non trouvée pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return puissance;
};

const getProducteurInfos = async ({ identifiantProjet, logger }: Props) => {
  const producteur = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
    type: 'Lauréat.Producteur.Query.ConsulterProducteur',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(producteur)) {
    logger.warn(`Producteur non trouvé pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return producteur;
};
