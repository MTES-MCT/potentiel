import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { CorrigerChangementReprésentantLégalPage } from '@/components/pages/représentant-légal/changement/corriger/CorrigerChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Corriger le changement de représentant légal du projet - Potentiel',
  description:
    "Formulaire de correction d'une demande de changement de représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const changement =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(changement)) {
      return notFound();
    }

    return (
      <CorrigerChangementReprésentantLégalPage
        identifiantProjet={mapToPlainObject(
          IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant)),
        )}
        typeReprésentantLégal={mapToPlainObject(changement.demande.typeReprésentantLégal)}
        nomReprésentantLégal={changement.demande.nomReprésentantLégal}
        pièceJustificative={mapToPlainObject(changement.demande.pièceJustificative)}
      />
    );
  });
}
