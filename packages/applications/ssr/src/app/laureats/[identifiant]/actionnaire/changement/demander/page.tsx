import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderChangementActionnairePage } from './DemanderChangementActionnaire.page';

export const metadata: Metadata = {
  title: "Demander un changement d'actionnaire(s) d'un projet - Potentiel",
  description: "Formulaire de demande de changement d'actionnaire(s) d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const actionnaireActuel = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(actionnaireActuel)) {
      return notFound();
    }

    return (
      <DemanderChangementActionnairePage
        identifiantProjet={mapToPlainObject(actionnaireActuel.identifiantProjet)}
        actionnaire={actionnaireActuel.actionnaire}
      />
    );
  });
}
