import { Metadata } from 'next';

import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getCahierDesCharges, récupérerLauréatSansAbandon } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DemanderAbandonPage } from './DemanderAbandon.page';
import { mediator } from 'mediateur';
import { Option } from '@potentiel-libraries/monads';

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
