import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';

import { EnregistrerChangementProducteurPage } from './EnregistrerChangementProducteur.page';

export const metadata: Metadata = {
  title: 'Changer le producteur du projet - Potentiel',
  description: 'Formulaire de changement de producteur du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const producteurActuel = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(producteurActuel)) {
      return notFound();
    }

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      producteurActuel.identifiantProjet,
      'information-enregistrée',
      'producteur',
    );

    return (
      <EnregistrerChangementProducteurPage
        identifiantProjet={mapToPlainObject(producteurActuel.identifiantProjet)}
        producteur={producteurActuel.producteur}
      />
    );
  });
}
