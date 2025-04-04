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
import { DemanderChangementPuissancePage } from '@/components/pages/puissance/demanderChangement/DemanderChangementPuissance.page';

export const metadata: Metadata = {
  title: "Demander un changement d'puissance(s) d'un projet - Potentiel",
  description: "Formulaire de demande de changement d'puissance(s) d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissanceActuel = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(puissanceActuel)) {
      return notFound();
    }

    return (
      <DemanderChangementPuissancePage
        identifiantProjet={mapToPlainObject(puissanceActuel.identifiantProjet)}
        puissance={puissanceActuel.puissance}
      />
    );
  });
}
