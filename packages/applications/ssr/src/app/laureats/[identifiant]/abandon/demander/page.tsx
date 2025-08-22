import type { Metadata } from 'next';

import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderAbandonPage } from './DemanderAbandon.page';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const lauréat = await récupérerLauréatSansAbandon(identifiantProjet);

    await vérifierQueLeCahierDesChargesPermetUnChangement(
      lauréat.identifiantProjet,
      'demande',
      'abandon',
    );

    return <DemanderAbandonPage identifiantProjet={identifiantProjet} />;
  });
}
