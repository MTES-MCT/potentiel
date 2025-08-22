import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderDélaiPage } from './DemanderDélai.page';

export const metadata: Metadata = {
  title: 'Demander un délai exceptionnel - Potentiel',
  description: 'Formulaire de demande de délai',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const lauréat = await récupérerLauréatSansAbandon(identifiantProjet);

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      lauréat.identifiantProjet,
      'demande',
      'délai',
    );

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(achèvement)) {
      return notFound();
    }

    return (
      <DemanderDélaiPage
        identifiantProjet={identifiantProjet}
        dateAchèvementPrévisionnelActuelle={mapToPlainObject(achèvement.dateAchèvementPrévisionnel)}
      />
    );
  });
}
