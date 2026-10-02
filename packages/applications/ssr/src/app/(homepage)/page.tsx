import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { getSessionUser } from '@/auth/getSessionUser';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { HomePage } from './Home.page';
import { HomePageDreal } from './HomePageDreal.page';

export const metadata: Metadata = { title: 'Accueil' };

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getSessionUser({ headers: await headers() });

    const isDreal = utilisateur?.estDreal();

    if (isDreal) {
      return <HomePageDreal />;
    }

    return <HomePage utilisateur={utilisateur} />;
  });
}
