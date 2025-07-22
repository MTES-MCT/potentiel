import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { AjouterGestionnaireRéseauPage } from './AjouterGestionnaireRéseau.page';

export default async function Page() {
  return PageWithErrorHandling(async () => <AjouterGestionnaireRéseauPage />);
}
