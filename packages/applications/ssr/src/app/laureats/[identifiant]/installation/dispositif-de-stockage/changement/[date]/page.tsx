import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { mapToDispositifDeStockageTimelineItemProps } from './(historique)/mapToDispositifDeStockageTimelineItemProps';
import { DétailsChangementDispositifDeStockagePage } from './DétailsChangementDispositifDeStockage.page';

export const metadata: Metadata = { title: 'Détail du changement du dispositif de stockage' };

type PageProps = {
  params: Promise<{
    identifiant: string;
    date: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, date } = params;

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
