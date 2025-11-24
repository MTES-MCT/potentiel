import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';

import { DemanderDélaiPage } from './DemanderDélai.page';

export const metadata: Metadata = {
  title: 'Demander un délai de force majeure - Potentiel',
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

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      lauréat.identifiantProjet,
      'demande',
      'délai',
    );

    return (
      <DemanderDélaiPage
        identifiantProjet={identifiantProjet}
        dateAchèvementPrévisionnelActuelle={mapToPlainObject(achèvement.dateAchèvementPrévisionnel)}
      />
    );
  });
}
