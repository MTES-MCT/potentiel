import { Metadata } from 'next';

import { AccessibilitePage } from '@/components/pages/accessibilite/Accessibilite.page';

export const metadata: Metadata = {
  title: 'Accueil - Potentiel',
};

export default async function Page() {
  return <AccessibilitePage />;
}
