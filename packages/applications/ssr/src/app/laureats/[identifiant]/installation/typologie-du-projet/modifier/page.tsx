import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ModifierTypologieDuProjetPage } from './ModifierTypologieDuProjet.page';

export const metadata: Metadata = {
  title: 'Modification de la typologie du projet - Potentiel',
  description: 'Formulaire de modification de la typologie du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const actuel = await mediator.send<Lauréat.Installation.ConsulterTypologieDuProjetQuery>({
      type: 'Lauréat.Installation.Query.ConsulterTypologieDuProjet',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return Option.isNone(actuel) ? (
      notFound()
    ) : (
      <ModifierTypologieDuProjetPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        typologieDuProjet={mapToPlainObject(actuel.typologieDuProjet)}
      />
    );
  });
}
