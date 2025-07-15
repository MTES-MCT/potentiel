import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { EnregistrerChangementActionnairePage } from './EnregistrerChangementActionnaire.page';

export const metadata: Metadata = {
  title: "Changement d'actionnaire(s) d'un projet - Potentiel",
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
      <EnregistrerChangementActionnairePage
        identifiantProjet={mapToPlainObject(actionnaireActuel.identifiantProjet)}
        actionnaire={actionnaireActuel.actionnaire}
      />
    );
  });
}
