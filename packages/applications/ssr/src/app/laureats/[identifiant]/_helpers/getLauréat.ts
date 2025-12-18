import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getCahierDesCharges } from '../../../_helpers';

type Props = IdentifiantProjet.RawType;

export type GetLauréat = {
  actionnaire: Lauréat.Actionnaire.ConsulterActionnaireReadModel;
  représentantLégal: Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Lauréat.Puissance.ConsulterPuissanceReadModel;
  producteur: Lauréat.Producteur.ConsulterProducteurReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  fournisseur: Lauréat.Fournisseur.ConsulterFournisseurReadModel;
  abandon?: Lauréat.Abandon.ConsulterAbandonReadModel;
};

export const getLauréat = cache(async (identifiantProjet: Props): Promise<GetLauréat> => {
  const lauréat = await getLauréatInfos(identifiantProjet);
  const actionnaireInfos = await getActionnaireInfos(identifiantProjet);
  const représentantLégalInfos = await getReprésentantLégalInfos(identifiantProjet);
  const puissanceInfos = await getPuissanceInfos(identifiantProjet);
  const producteurInfos = await getProducteurInfos(identifiantProjet);
  const fournisseurInfos = await getFournisseurInfos(identifiantProjet);
  const abandonInfo = await getAbandonInfos(identifiantProjet);

  return {
    actionnaire: actionnaireInfos,
    représentantLégal: représentantLégalInfos,
    puissance: puissanceInfos,
    producteur: producteurInfos,
    fournisseur: fournisseurInfos,
    abandon: abandonInfo,
    lauréat,
  };
});

export const getLauréatInfos = cache(async (identifiantProjet: Props) => {
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
});

export const getActionnaireInfos = async (identifiantProjet: Props) => {
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

export const getReprésentantLégalInfos = cache(async (identifiantProjet: Props) => {
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
});

export const getPuissanceInfos = cache(async (identifiantProjet: Props) => {
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
});

export const getCahierDesChargesPuissanceDeSiteInfos = cache(async (identifiantProjet: Props) => {
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  return cahierDesCharges.getChampsSupplémentaires()['puissanceDeSite'];
});

export const getProducteurInfos = async (identifiantProjet: Props) => {
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

export const getFournisseurInfos = cache(async (identifiantProjet: Props) => {
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
});

export const getAbandonInfos = cache(async (identifiantProjet: Props) => {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  return Option.isSome(abandon) ? abandon : undefined;
});

export const getNatureDeLExploitationInfos = cache(async (identifiantProjet: Props) => {
  const natureDeLExploitation =
    await mediator.send<Lauréat.NatureDeLExploitation.ConsulterNatureDeLExploitationQuery>({
      type: 'Lauréat.NatureDeLExploitation.Query.ConsulterNatureDeLExploitation',
      data: {
        identifiantProjet,
      },
    });

  return Option.isSome(natureDeLExploitation) ? natureDeLExploitation : undefined;
});

export const getInstallationInfos = cache(async (identifiantProjet: Props) => {
  const installation = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
    type: 'Lauréat.Installation.Query.ConsulterInstallation',
    data: {
      identifiantProjet,
    },
  });

  return Option.isSome(installation) ? installation : undefined;
});
