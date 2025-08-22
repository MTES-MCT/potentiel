import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { CorrigerChangementReprésentantLégalPage } from './CorrigerChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Corriger la demande de changement du représentant légal du projet - Potentiel',
  description: "Correction de la demande de changement du représentant légal d'un projet",
};

type PageProps = {
  params: {
    identifiant: string;
    date: string;
  };
};

export default async function Page({ params: { identifiant, date } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const demandéLe = decodeParameter(date);

    const changement =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          demandéLe,
        },
      });

    if (Option.isNone(changement)) {
      return notFound();
    }

    return (
      <CorrigerChangementReprésentantLégalPage
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        dateDemande={mapToPlainObject(changement.demande.demandéLe)}
        nomReprésentantLégal={changement.demande.nomReprésentantLégal}
        typeReprésentantLégal={mapToPlainObject(changement.demande.typeReprésentantLégal)}
        pièceJustificative={mapToPlainObject(changement.demande.pièceJustificative)}
      />
    );
  });
}
