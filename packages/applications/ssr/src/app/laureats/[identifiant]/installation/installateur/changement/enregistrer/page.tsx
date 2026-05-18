import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { EnregistrerChangementInstallateurPage } from './EnregistrerChangementInstallateur.page';

export const metadata: Metadata = { title: "Changer l'installateur du projet" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

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

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        identifiantProjet,
        'information-enregistrée',
        'installateur',
      );

      return (
        <EnregistrerChangementInstallateurPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          installateur={Option.isSome(actuel) ? mapToPlainObject(actuel.installateur) : undefined}
        />
      );
    }),
  );
}
