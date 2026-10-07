import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { getSessionUser } from '@/auth/getSessionUser';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { HomePageAdministration } from './(homepage-administration)/HomePageAdministration.page';
import { HomePage } from './Home.page';

export const metadata: Metadata = { title: 'Accueil' };

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getSessionUser({ headers: await headers() });

    // TODO: remplacer par la bonne méthode dans utilisateur après merge alertes
    const isAdministration = utilisateur?.estDreal() || utilisateur?.estDGEC();

    if (isAdministration) {
      return <HomePageAdministration utilisateur={utilisateur} />;
    }

    return <HomePage utilisateur={utilisateur} />;
  });
}
