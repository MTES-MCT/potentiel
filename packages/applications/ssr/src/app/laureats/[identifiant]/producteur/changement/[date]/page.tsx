import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { mapToProducteurTimelineItemProps } from '../../(historique)/mapToProducteurTimelineItemProps';

import { DétailsProducteurPage } from './DétailsChangementProducteur.page';

export const metadata: Metadata = {
  title: 'Détail du changement de producteur du projet - Potentiel',
  description: 'Détail du changement de producteur du projet',
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

    const changement = await mediator.send<Lauréat.Producteur.ConsulterChangementProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterChangementProducteur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        enregistréLe,
      },
    });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique =
      await mediator.send<Lauréat.Producteur.ListerHistoriqueProducteurProjetQuery>({
        type: 'Lauréat.Producteur.Query.ListerHistoriqueProducteurProjet',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    return (
      <DétailsProducteurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historique.items.map(mapToProducteurTimelineItemProps)}
      />
    );
  });
}
