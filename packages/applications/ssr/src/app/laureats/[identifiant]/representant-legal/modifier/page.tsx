import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierReprésentantLégalPage } from '@/components/pages/représentant-légal/modifier/ModifierReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Corriger le représentant légal du projet - Potentiel',
  description: "Formulaire de correction du représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const représentantLégalActuel =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(représentantLégalActuel)) {
      return notFound();
    }

    return (
      <ModifierReprésentantLégalPage
        identifiantProjet={mapToPlainObject(représentantLégalActuel.identifiantProjet)}
        nomReprésentantLégal={représentantLégalActuel.nomReprésentantLégal}
        typeReprésentantLégal={mapToPlainObject(représentantLégalActuel.typeReprésentantLégal)}
      />
    );
  });
}
