import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ModifierInstallationAvecDispositifDeStockagePage } from './ModifierInstallationAvecDispositifDeStockage.page';

export const metadata: Metadata = {
  title: "Changement du couplage de l'installation à un dispositif de stockage - Potentiel",
  description: "Formulaire de changement du couplage de l'installation à un dispositif de stockage",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const actuel =
      await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageQuery>(
        {
          type: 'Lauréat.InstallationAvecDispositifDeStockage.Query.ConsulterInstallationAvecDispositifDeStockage',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        },
      );

    if (Option.isNone(actuel)) {
      return notFound();
    }

    return (
      <ModifierInstallationAvecDispositifDeStockagePage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        installationAvecDispositifDeStockage={actuel.installationAvecDispositifDeStockage}
      />
    );
  });
}
