import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';
import { CorrigerReprésentantLégalPage } from '@/components/pages/changement-représentant-légal/corriger/CorrigerReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Corriger le représentant légal du projet - Potentiel',
  description: "Formulaire de correction du représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const { statut } = await récupérerProjet(identifiantProjet);

    await vérifierQueLeProjetEstClassé({
      statut,
      message: "Vous ne pouvez pas demander l'abandon d'un projet non lauréat",
    });

    const représentantLégalActuel =
      await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet,
        },
      });

    if (Option.isNone(représentantLégalActuel)) {
      return notFound();
    }

    return (
      <CorrigerReprésentantLégalPage
        identifiantProjet={identifiantProjet}
        nomRepresentantLegal={représentantLégalActuel.nomReprésentantLégal}
      />
    );
  });
}
