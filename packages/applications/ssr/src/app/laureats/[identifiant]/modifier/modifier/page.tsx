import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Producteur } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierProducteurPage } from '@/components/pages/producteur/modifier/ModifierProducteur.page';

export const metadata: Metadata = {
  title: 'Changement de producteur du projet - Potentiel',
  description: "Formulaire de changement de producteur d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const producteurActuel = await mediator.send<Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(producteurActuel)) {
      return notFound();
    }

    return (
      <ModifierProducteurPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        producteur={producteurActuel.producteur}
      />
    );
  });
}
