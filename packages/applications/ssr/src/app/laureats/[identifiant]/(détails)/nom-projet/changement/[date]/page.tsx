import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import {
  LauréatHistoryRecord,
  mapToLauréatTimelineItemProps,
} from '../../../../(historique)/mapToLauréatTimelineItemProps';

import { DétailsNomProjetPage } from './DétailsChangementNomProjet.page';

export const metadata: Metadata = {
  title: 'Détail du changement de nom du projet - Potentiel',
  description: 'Détail du changement de nom du projet',
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

    const changement = await mediator.send<Lauréat.ConsulterChangementNomProjetQuery>({
      type: 'Lauréat.Query.ConsulterChangementNomProjet',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        enregistréLe,
      },
    });

    if (Option.isNone(changement)) {
      return notFound();
    }

    const historique = await mediator.send<Lauréat.ListerHistoriqueLauréatQuery>({
      type: 'Lauréat.Query.ListerHistoriqueLauréat',
      data: {
        identifiantProjet: identifiant,
      },
    });

    const historiqueChangementNomProjet = historique.items.filter((v) =>
      ['NomProjetModifié-V1', 'ChangementNomProjetEnregistré-V1'].includes(v.type),
    );

    return (
      <DétailsNomProjetPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        changement={mapToPlainObject(changement.changement)}
        historique={historiqueChangementNomProjet.map((readmodel) =>
          mapToLauréatTimelineItemProps({
            readmodel: readmodel as LauréatHistoryRecord,
            doitAfficherLienAttestationDésignation: false,
          }),
        )}
      />
    );
  });
}
