import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierPuissancePage } from '@/components/pages/puissance/modifier/ModifierPuissance.page';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';

export const metadata: Metadata = {
  title: 'Changement de puissance du projet - Potentiel',
  description: "Formulaire de changement de puissance d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    const candidature = await getCandidature(identifiantProjet.formatter());

    if (Option.isNone(puissance)) {
      return notFound();
    }

    return (
      <ModifierPuissancePage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        puissance={puissance.puissance}
        unitéPuissance={candidature.unitéPuissance.formatter()}
      />
    );
  });
}
