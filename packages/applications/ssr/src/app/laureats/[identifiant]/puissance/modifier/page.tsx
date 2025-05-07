import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierPuissancePage } from '@/components/pages/puissance/modifier/ModifierPuissance.page';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const metadata: Metadata = {
  title: 'Changement de puissance du projet - Potentiel',
  description: "Formulaire de changement de puissance d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissanceActuelle = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(puissanceActuelle)) {
      return notFound();
    }

    const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);

    return (
      <ModifierPuissancePage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        puissance={puissanceActuelle.puissance}
        unitéPuissance={appelOffres.unitePuissance}
      />
    );
  });
}
