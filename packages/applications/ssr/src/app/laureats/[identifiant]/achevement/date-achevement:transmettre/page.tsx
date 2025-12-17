import { Metadata } from 'next';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import { TransmettreDateAchèvementPage } from './TransmettreDateAchèvement.page';

export const metadata: Metadata = {
  title: `Transmettre la date d'achèvement - Potentiel`,
  description: `Formulaire de transmission de la date d'achèvement du projet`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerLauréatNonAbandonné(identifiantProjet);

    return (
      <TransmettreDateAchèvementPage
        identifiantProjet={projet.identifiantProjet.formatter()}
        lauréatNotifiéLe={projet.notifiéLe.formatter()}
      />
    );
  });
}
