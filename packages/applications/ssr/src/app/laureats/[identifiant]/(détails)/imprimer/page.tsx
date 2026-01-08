import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';
import { getCahierDesCharges } from '../../../../_helpers';

import { ImprimerPage } from './Imprimer.page';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
    const champsSupplémentaires = cahierDesCharges.getChampsSupplémentaires();
    const afficherSectionInstallation = !!(
      champsSupplémentaires.installateur ||
      champsSupplémentaires.dispositifDeStockage ||
      champsSupplémentaires.natureDeLExploitation ||
      champsSupplémentaires.typologieInstallation ||
      champsSupplémentaires.autorisationDUrbanisme
    );

    checkFeatureFlag(identifiantProjet, searchParams);

    return (
      <ImprimerPage
        identifiantProjet={identifiantProjet.formatter()}
        afficherSectionInstallation={afficherSectionInstallation}
      />
    );
  });
}
