import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getCahierDesCharges } from '@/app/_helpers';

import { getPuissanceInfos } from '../../../_helpers/getLauréat';

import { DemanderChangementPuissancePage } from './DemanderChangementPuissance.page';
import { DemandeEnCoursPage } from '../../../(détails)/(components)/DemandeEnCours.page';
import { Routes } from '@potentiel-applications/routes';

export const metadata: Metadata = {
  title: 'Demander le changement de puissance du projet - Potentiel',
  description: 'Formulaire de demande de changement de puissance du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissance = await getPuissanceInfos(identifiantProjet.formatter());

    if (puissance.dateDemandeEnCours) {
      return (
        <DemandeEnCoursPage
          title="Demande de changement de puissance"
          href={Routes.Puissance.changement.détails(
            identifiantProjet.formatter(),
            puissance.dateDemandeEnCours.formatter(),
          )}
        />
      );
    }

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
    cahierDesCharges.vérifierQueLeChangementEstPossible('information-enregistrée', 'puissance');

    const infosCahierDesChargesPuissanceDeSite =
      cahierDesCharges.getChampsSupplémentaires()['puissanceDeSite'];

    const volumeRéservé = await mediator.send<Lauréat.Puissance.ConsulterVolumeRéservéQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterVolumeRéservé',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return (
      <DemanderChangementPuissancePage
        identifiantProjet={mapToPlainObject(puissance.identifiantProjet)}
        puissance={puissance.puissance}
        puissanceDeSite={puissance.puissanceDeSite}
        unitéPuissance={mapToPlainObject(puissance.unitéPuissance)}
        cahierDesCharges={mapToPlainObject(cahierDesCharges)}
        volumeRéservé={Option.isSome(volumeRéservé) ? mapToPlainObject(volumeRéservé) : undefined}
        puissanceInitiale={puissance.puissanceInitiale}
        infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
      />
    );
  });
}
