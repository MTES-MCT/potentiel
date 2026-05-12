import { Metadata } from 'next';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { HomePage } from './Home.page';
import { getSessionUser } from '@/auth/getSessionUser';
import { headers } from 'next/headers';

export const metadata: Metadata = { title: 'Accueil' };

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getSessionUser({ headers: await headers() });

    return <HomePage utilisateur={utilisateur} />;
  });
}
