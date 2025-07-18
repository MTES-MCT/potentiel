import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { CorrigerDemandeDélaiPage } from './CorrigerDemandeDélai.page';

export const metadata: Metadata = {
  title: 'Corriger la demande de délai du projet - Potentiel',
  description: "Correction de la demande de délai d'un projet",
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

    const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe,
      },
    });

    if (Option.isNone(demande)) {
      return notFound();
    }

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(achèvement)) {
      return notFound();
    }

    return (
      <CorrigerDemandeDélaiPage
        identifiantProjet={identifiantProjet.formatter()}
        dateDemande={demande.demandéLe.formatter()}
        dateAchèvementPrévisionnelActuelle={achèvement.dateAchèvementPrévisionnel.formatter()}
        nombreDeMois={demande.nombreDeMois}
        raison={demande.raison}
        pièceJustificative={demande.pièceJustificative.formatter()}
      />
    );
  });
}
