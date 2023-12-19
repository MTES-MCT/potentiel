import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { AjouterGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/AjouterGestionnaireRéseauPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getUser();
    if (!utilisateur) {
      redirect('/login.html');
    }

    return <AjouterGestionnaireRéseauPage />;
  });
}
