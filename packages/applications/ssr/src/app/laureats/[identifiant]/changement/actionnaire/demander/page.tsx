import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderChangementActionnairePage } from '@/components/pages/actionnaire/demanderChangement/DemanderChangementActionnaire.page';

export const metadata: Metadata = {
  title: "Demander un changement d'actionnaire d'un projet - Potentiel",
  description: "Formulaire de demande de changement d'actionnaire d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const actionnaireActuel = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
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
