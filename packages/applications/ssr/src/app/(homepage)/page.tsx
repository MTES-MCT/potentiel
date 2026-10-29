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

    return utilisateur?.rôle.aLaPermission('tableauDeBord.consulter') ? (
      <HomePageAdministration utilisateur={utilisateur} />
    ) : (
      <HomePage utilisateur={utilisateur} />
    );
  });
}
