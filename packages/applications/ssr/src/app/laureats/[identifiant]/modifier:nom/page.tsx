import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { ModifierNomProjetPage } from '@/components/pages/lauréat/modifier/nom/ModifierNomProjet.page';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Modifier le projet - Potentiel',
  description: 'Modifier le projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });
    if (Option.isNone(lauréat)) {
      return notFound();
    }

    return (
      <ModifierNomProjetPage identifiantProjet={identifiantProjet} nomProjet={lauréat.nomProjet} />
    );
  });
}
