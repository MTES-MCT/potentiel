import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Recours } from '@potentiel-domain/elimine';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DétailsRecoursPage } from '@/components/pages/recours/détails/DétailsRecours.page';

type PageProps = IdentifiantParameter;

/**
 *
 * @todo afficher le nom du projet dans le title de la page
 */
export const metadata: Metadata = {
  title: 'Détail recours projet - Potentiel',
  description: "Détail du recours d'un projet",
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(recours)) {
        return notFound();
      }

      return (
        <DétailsRecoursPage
          recours={mapToPlainObject(recours)}
          identifiantProjet={identifiantProjet}
          role={mapToPlainObject(utilisateur.role)}
        />
      );
    }),
  );
}
