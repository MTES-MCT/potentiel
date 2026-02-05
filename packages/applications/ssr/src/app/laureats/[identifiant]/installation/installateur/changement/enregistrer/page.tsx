import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { EnregistrerChangementInstallateurPage } from './EnregistrerChangementInstallateur.page';

export const metadata: Metadata = {
  title: "Changer l'installateur du projet - Potentiel",
  description: "Formulaire de changement d'installateur du projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Installation.EnregistrerChangementInstallateurUseCase>(
        'Lauréat.Installateur.UseCase.EnregistrerChangement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actuel = await mediator.send<Lauréat.Installation.ConsulterInstallateurQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallateur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actuel)) {
        return notFound();
      }

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        actuel.identifiantProjet,
        'information-enregistrée',
        'installateur',
      );

      return (
        <EnregistrerChangementInstallateurPage
          identifiantProjet={mapToPlainObject(actuel.identifiantProjet)}
          installateur={mapToPlainObject(actuel.installateur)}
        />
      );
    }),
  );
}
