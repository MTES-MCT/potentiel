import { Metadata } from 'next';

import { getContext } from '@potentiel-applications/request-context';

import { HomePage } from '@/components/pages/home/HomePage.page';

export const metadata: Metadata = {
  title: 'Accueil - Potentiel',
};

export default async function Page() {
  const utilisateur = getContext()?.utilisateur;

  return <HomePage utilisateur={utilisateur} />;
}
