import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { DétailsChangementDispositifDeStockagePage } from './DétailsChangementDispositifDeStockage.page';
import { mapToDispositifDeStockageTimelineItemProps } from './(historique)/mapToDispositifDeStockageTimelineItemProps';

export const metadata: Metadata = {
  title: 'Détail du changement du dispositif de stockage du projet - Potentiel',
  description: 'Détail du changement du dispositif de stockage du projet',
};

type PageProps = {
  params: {
    identifiant: string;
    date: string;
  };
};

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const enregistréLe = decodeParameter(date);

    const changement =
      await mediator.send<Lauréat.Installation.ConsulterChangementDispositifDeStockageQuery>({
        type: 'Lauréat.Installation.Query.ConsulterChangementDispositifDeStockage',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe,
        },
      });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique =
      await mediator.send<Lauréat.Installation.ListerHistoriqueInstallationProjetQuery>({
        type: 'Lauréat.Installation.Query.ListerHistoriqueInstallationProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    return (
      <DétailsChangementDispositifDeStockagePage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items
          .map(mapToDispositifDeStockageTimelineItemProps)
          .filter((i) => i !== null)}
      />
    );
  });
}
