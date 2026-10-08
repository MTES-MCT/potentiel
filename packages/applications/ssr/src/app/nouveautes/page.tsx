import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { getSessionUser } from '@/auth/getSessionUser';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { NouveautésSection } from './Nouveautes.section';

export const metadata: Metadata = { title: 'Accueil' };

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getSessionUser({ headers: await headers() });

    if (
      !featureFlag.includes('nouveautes') &&
      !utilisateur?.estAdministration() &&
      !utilisateur?.estAdministrateur()
    ) {
      return notFound();
    }

    return <NouveautésSection nouveautes={[]} />;
  });
}
