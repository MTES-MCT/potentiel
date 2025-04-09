import { Metadata } from 'next';

import { getContext } from '@potentiel-applications/request-context';

import { HomePage } from '@/components/pages/home/Home.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export const metadata: Metadata = {
  title: 'Accueil - Potentiel',
};

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = getContext()?.utilisateur;

    return <HomePage utilisateur={utilisateur} />;
  });
}
