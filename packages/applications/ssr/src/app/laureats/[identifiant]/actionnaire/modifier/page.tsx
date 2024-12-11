import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierActionnairePage } from '@/components/pages/actionnaire/modifier/ModifierActionnaire.page';

export const metadata: Metadata = {
  title: 'Modifier le représentant légal du projet - Potentiel',
  description: "Formulaire de modification du représentant légal d'un projet",
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
      <ModifierActionnairePage
        identifiantProjet={mapToPlainObject(actionnaireActuel.identifiantProjet)}
        actionnaire={actionnaireActuel.actionnaire}
      />
    );
  });
}
