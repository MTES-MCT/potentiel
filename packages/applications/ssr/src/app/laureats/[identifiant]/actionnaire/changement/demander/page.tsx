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

import { DemanderChangementActionnairePage } from './DemanderChangementActionnaire.page';
import { RedirectionDemandePage } from '../../../(détails)/(components)/RedirectionDemande';
import { Routes } from '@potentiel-applications/routes';

export const metadata: Metadata = {
  title: "Demander un changement d'actionnaire(s) d'un projet - Potentiel",
  description: "Formulaire de demande de changement d'actionnaire(s) d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(actionnaire)) {
      return notFound();
    }

    if (actionnaire.dateDemandeEnCours) {
      return (
        <RedirectionDemandePage
          title="Demande de changement d'actionnaire(s)"
          href={Routes.Actionnaire.changement.détails(
            identifiantProjet.formatter(),
            actionnaire.dateDemandeEnCours.formatter(),
          )}
        />
      );
    }

    return (
      <DemanderChangementActionnairePage
        identifiantProjet={mapToPlainObject(actionnaire.identifiantProjet)}
        actionnaire={actionnaire.actionnaire}
      />
    );
  });
}
