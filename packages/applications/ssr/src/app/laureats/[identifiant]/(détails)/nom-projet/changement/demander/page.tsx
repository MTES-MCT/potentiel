import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers';

import { EnregistrerChangementNomProjetPage } from './EnregistrerChangementNomProjet.page';

export const metadata: Metadata = {
  title: 'Changement de nom du projet - Potentiel',
  description: 'Formulaire de demande de changement de nom du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
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

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      lauréat.identifiantProjet,
      'information-enregistrée',
      'nomProjet',
    );

    return (
      <EnregistrerChangementNomProjetPage
        identifiantProjet={mapToPlainObject(lauréat.identifiantProjet)}
        nomProjet={lauréat.nomProjet}
      />
    );
  });
}
