import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Role } from '@potentiel-domain/utilisateur';
import { GristApiClient } from '@potentiel-infrastructure/grist-api-client';
import { getLogger } from '@potentiel-libraries/monitoring';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { getSessionUser } from '@/auth/getSessionUser';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { NouveautésSection, type NouveautésSectionProps } from './Nouveautes.section';

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

    const nouveautes = await getNouveautés({ rôle: utilisateur?.rôle ?? Role.visiteur });

    return <NouveautésSection nouveautes={nouveautes.map(mapToNouveautéSectionProps)} />;
  });
}

type GetNouveautésProps = {
  rôle: Role.ValueType;
};

const getNouveautés = async ({
  rôle,
}: GetNouveautésProps): Promise<Array<GristApiClient.Nouveauté>> => {
  try {
    const nouveautés = await GristApiClient.récupérerNouveautés();

    return nouveautés.filter(({ rôles }) => rôle.estAdmin() || rôles.includes(rôle.nom));
  } catch (error) {
    getLogger('getNouveautés').error(error as Error);
    return [];
  }
};

const mapToNouveautéSectionProps = ({
  titre,
  description,
  date,
  lien,
}: GristApiClient.Nouveauté): NouveautésSectionProps['nouveautes'][number] => ({
  title: titre,
  content: description,
  date,
  link: lien ? { href: lien.url, external: lien.type === 'externe' } : undefined,
});
