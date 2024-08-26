import { ImporterDatesMiseEnServicePage } from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/ImporterDatesMiseEnService.page';

import { importerDatesMiseEnServiceAction } from './action';

export default async function Page() {
  return <ImporterDatesMiseEnServicePage action={importerDatesMiseEnServiceAction} />;
}
