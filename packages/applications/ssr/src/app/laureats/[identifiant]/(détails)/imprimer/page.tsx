import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { getCahierDesCharges } from '../../../../_helpers';

import { ImprimerPage } from './Imprimer.page';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
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

    return (
      <ImprimerPage
        identifiantProjet={identifiantProjet.formatter()}
        afficherSectionInstallation={afficherSectionInstallation}
      />
    );
  });
}
