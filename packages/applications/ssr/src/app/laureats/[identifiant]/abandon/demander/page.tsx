import { Metadata } from 'next';

import { Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DemanderAbandonPage } from './DemanderAbandon.page';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Abandon.DemanderAbandonUseCase>(
        'Lauréat.Abandon.UseCase.DemanderAbandon',
      );

      const identifiantProjet = decodeParameter(identifiant);

      const lauréat = await récupérerLauréatSansAbandon(identifiantProjet);

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        lauréat.identifiantProjet,
        'demande',
        'abandon',
      );

      return <DemanderAbandonPage identifiantProjet={identifiantProjet} />;
    }),
  );
}
