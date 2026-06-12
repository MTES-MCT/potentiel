import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { assertIdentifiantProjet } from '@/app/_helpers/assertIdentifiantProjet';

export const getActionnaireInfos = async (identifiantProjet: string) => {
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

export const getReprésentantLégalInfos = cache(async (identifiantProjet: string) => {
  const logger = getLogger('getReprésentantLégalInfos');
  assertIdentifiantProjet(identifiantProjet);
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

export const getPuissanceInfos = cache(async (identifiantProjet: string) => {
  const logger = getLogger('getPuissanceInfos');
  assertIdentifiantProjet(identifiantProjet);
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

export const getProducteurInfos = async (identifiantProjet: string) => {
  const logger = getLogger('getProducteurInfos');
  assertIdentifiantProjet(identifiantProjet);
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

export const getFournisseurInfos = cache(async (identifiantProjet: string) => {
  const logger = getLogger('getFournisseurInfos');
  assertIdentifiantProjet(identifiantProjet);
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

export const getOptionalAbandon = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  return Option.isSome(abandon) ? abandon : undefined;
});

export const getOptionalDemandeAbandon = cache(
  async (identifiantProjet: string, demandéLe: string) => {
    assertIdentifiantProjet(identifiantProjet);
    const demandeAbandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        demandéLeValue: demandéLe,
      },
    });

    return Option.isSome(demandeAbandon) ? demandeAbandon : undefined;
  },
);

export const getOptionalDemandeAbandonEnCours = cache(async (identifiantProjet: string) => {
  const abandon = await getOptionalAbandon(identifiantProjet);
  if (!abandon) {
    return;
  }
  return getOptionalDemandeAbandon(identifiantProjet, abandon.demandéLe.formatter());
});

export const getDemandeAbandonEnCours = makeRequired(getOptionalDemandeAbandonEnCours);
export const getAbandon = makeRequired(getOptionalAbandon);

export const getNatureDeLExploitationInfos = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const natureDeLExploitation =
    await mediator.send<Lauréat.NatureDeLExploitation.ConsulterNatureDeLExploitationQuery>({
      type: 'Lauréat.NatureDeLExploitation.Query.ConsulterNatureDeLExploitation',
      data: {
        identifiantProjet,
      },
    });

  return Option.isSome(natureDeLExploitation) ? natureDeLExploitation : undefined;
});

export const getInstallationInfos = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const installation = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
    type: 'Lauréat.Installation.Query.ConsulterInstallation',
    data: {
      identifiantProjet,
    },
  });

  return Option.isSome(installation) ? installation : undefined;
});

export const getInstallateurInfos = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const installateur = await mediator.send<Lauréat.Installation.ConsulterInstallateurQuery>({
    type: 'Lauréat.Installation.Query.ConsulterInstallateur',
    data: {
      identifiantProjet,
    },
  });

  return Option.isSome(installateur) ? installateur : undefined;
});

export const getPowerPurchaseAgreementInfos = cache(async (identifiantProjet: string) => {
  assertIdentifiantProjet(identifiantProjet);
  const powerPurchaseAgreement =
    await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
      type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

  return Option.isSome(powerPurchaseAgreement) ? powerPurchaseAgreement : undefined;
});

function makeRequired<TReturn, TParams extends Array<string>>(
  getOptionalValue: (...params: TParams) => Promise<TReturn | undefined>,
): (...params: TParams) => Promise<TReturn> {
  return cache(async (...params: TParams) => {
    const value = await getOptionalValue(...params);
    if (!value) {
      return notFound();
    }
    return value;
  });
}
