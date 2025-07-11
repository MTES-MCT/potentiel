import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { DétailsDemandeDélaiPage } from './DétailsDemandeDélai.page';

export const metadata: Metadata = {
  title: 'Détail de la demande de délai - Potentiel',
  description: 'Détail de la demande de délai',
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

    const demandéLe = decodeParameter(date);

    const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe,
      },
    });

    if (Option.isNone(demande)) {
      return notFound();
    }

    return (
      <DétailsDemandeDélaiPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        demande={mapToPlainObject(demande)}
      />
    );
  });
}
