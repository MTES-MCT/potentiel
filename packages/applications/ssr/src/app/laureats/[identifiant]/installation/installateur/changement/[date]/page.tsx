import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { mapToInstallateurTimelineItemProps } from './(historique)/mapToInstallateurTimelineItemProps';
import { DétailsChangementInstallateurPage } from './DétailsChangementInstallateur.page';

export const metadata: Metadata = { title: "Détail du changement de l'installateur" };

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
      await mediator.send<Lauréat.Installation.ConsulterChangementInstallateurQuery>({
        type: 'Lauréat.Installateur.Query.ConsulterChangementInstallateur',
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
      <DétailsChangementInstallateurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items
          .map(mapToInstallateurTimelineItemProps)
          .filter((i) => i !== null)}
      />
    );
  });
}
