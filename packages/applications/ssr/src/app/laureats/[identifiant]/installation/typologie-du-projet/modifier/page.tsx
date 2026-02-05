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
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierTypologieInstallationPage } from './ModifierTypologieInstallation.page';

export const metadata: Metadata = {
  title: 'Modification de la typologie du projet - Potentiel',
  description: 'Formulaire de modification de la typologie du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Installation.ModifierTypologieInstallationUseCase>(
        'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actuel = await mediator.send<Lauréat.Installation.ConsulterTypologieInstallationQuery>({
        type: 'Lauréat.Installation.Query.ConsulterTypologieInstallation',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actuel)) {
        return notFound();
      }

      return (
        <ModifierTypologieInstallationPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          typologieInstallation={mapToPlainObject(actuel.typologieInstallation)}
        />
      );
    }),
  );
}
