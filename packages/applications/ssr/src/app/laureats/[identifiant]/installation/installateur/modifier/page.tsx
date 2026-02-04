import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierInstallateurPage } from './ModifierInstallateur.page';

export const metadata: Metadata = {
  title: "Changement d'installateur du projet - Potentiel",
  description: "Formulaire de changement d'installateur du projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Installation.ModifierInstallateurUseCase>(
        'Lauréat.Installation.UseCase.ModifierInstallateur',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const installateurActuel =
        await mediator.send<Lauréat.Installation.ConsulterInstallateurQuery>({
          type: 'Lauréat.Installation.Query.ConsulterInstallateur',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(installateurActuel)) {
        return notFound();
      }

      return (
        <ModifierInstallateurPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          installateur={installateurActuel.installateur}
        />
      );
    }),
  );
}
