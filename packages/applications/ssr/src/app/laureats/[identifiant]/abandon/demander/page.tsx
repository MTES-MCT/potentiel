import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges, récupérerLauréatSansAbandon } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemanderAbandonPage } from './DemanderAbandon.page';

export const metadata: Metadata = { title: "Demander l'abandon" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Abandon.DemanderAbandonUseCase>(
        'Lauréat.Abandon.UseCase.DemanderAbandon',
      );

      const identifiantProjet = decodeParameter(identifiant);

      const lauréat = await récupérerLauréatSansAbandon(identifiantProjet);

      const powerPurchaseAgreement =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          data: { identifiantProjetValue: lauréat.identifiantProjet.formatter() },
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
        });

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

      const autoritéCompétente = cahierDesCharges.getAutoritéCompétente('abandon');
      cahierDesCharges.vérifierQueLeChangementEstPossible('demande', 'abandon');

      return (
        <DemanderAbandonPage
          identifiantProjet={identifiantProjet}
          autoritéCompétente={autoritéCompétente}
          estDéjàSignaléPPA={Option.isSome(powerPurchaseAgreement)}
        />
      );
    }),
  );
}
