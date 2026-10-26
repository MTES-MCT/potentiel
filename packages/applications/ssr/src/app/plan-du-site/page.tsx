import type { Metadata } from 'next';

import { getNavigationItemsBasedOnRole } from '@/components/organisms/header/UserBasedRoleNavigation/UserBasedRoleNavigation';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { PlanDuSitePage } from './PlanDuSite.page';

export const metadata: Metadata = { title: 'Plan du site' };

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const items = await getNavigationItemsBasedOnRole({ utilisateur, showNombreDemande: false });

      return <PlanDuSitePage mainNavigation={{ items }} />;
    }),
  );
}
