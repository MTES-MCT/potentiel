import { Metadata } from 'next';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';

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
