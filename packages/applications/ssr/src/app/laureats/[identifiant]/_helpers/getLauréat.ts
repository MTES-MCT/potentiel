import { mediator } from 'mediateur';
import { cache } from 'react';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getCahierDesCharges } from '../../../_helpers';

type Props = {
  identifiantProjet: string;
};

export type GetLauréat = {
  actionnaire: Lauréat.Actionnaire.ConsulterActionnaireReadModel;
  représentantLégal: Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Lauréat.Puissance.ConsulterPuissanceReadModel;
  producteur: Lauréat.Producteur.ConsulterProducteurReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  fournisseur: Lauréat.Fournisseur.ConsulterFournisseurReadModel;
  installateur?: Lauréat.Installateur.ConsulterInstallateurReadModel;
};

export const getLauréat = cache(async ({ identifiantProjet }: Props): Promise<GetLauréat> => {
  const lauréat = await getLauréatInfos({ identifiantProjet });
  const actionnaireInfos = await getActionnaireInfos({ identifiantProjet });
  const représentantLégalInfos = await getReprésentantLégalInfos({ identifiantProjet });
  const puissanceInfos = await getPuissanceInfos({ identifiantProjet });
  const producteurInfos = await getProducteurInfos({ identifiantProjet });
  const fournisseurInfos = await getFournisseurInfos({ identifiantProjet });
  const installateurInfos = await getInstallateurInfos({ identifiantProjet });

  return {
    actionnaire: actionnaireInfos,
    représentantLégal: représentantLégalInfos,
    puissance: puissanceInfos,
    producteur: producteurInfos,
    fournisseur: fournisseurInfos,
    installateur: installateurInfos,
    lauréat,
  };
});

export const getLauréatInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getLauréatInfos');

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

const getActionnaireInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getActionnaireInfos');

  const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
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

export const getReprésentantLégalInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getReprésentantLégalInfos');

  const représentantLégal =
    await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
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

export const getPuissanceInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getPuissanceInfos');

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

export const getProducteurInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getProducteurInfos');

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

export const getFournisseurInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getFournisseurInfos');

  const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
    type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(fournisseur)) {
    logger.warn(`Fournisseur non trouvé pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return fournisseur;
};

export const getInstallateurInfos = async ({ identifiantProjet }: Props) => {
  const logger = getLogger('getInstallateurInfos');

  const cahierDesCharges = await getCahierDesCharges(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  const champsSupplémentaires = CahierDesCharges.bind(cahierDesCharges).getChampsSupplémentaires();

  if (!champsSupplémentaires.installateur) {
    logger.info(`Le cahier des charges du projet lauréat ne prévoit pas de champ installateur`, {
      identifiantProjet,
    });
    return undefined;
  }

  const installateur = await mediator.send<Lauréat.Installateur.ConsulterInstallateurQuery>({
    type: 'Lauréat.Installateur.Query.ConsulterInstallateur',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(installateur)) {
    logger.warn(`Installateur non trouvé pour le projet lauréat`, { identifiantProjet });
    return notFound();
  }

  return installateur;
};
