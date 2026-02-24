import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getCahierDesCharges } from '@/app/_helpers';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getPuissanceInfos } from '../../../_helpers/getLauréat';

import { DemanderChangementPuissancePage } from './DemanderChangementPuissance.page';

export const metadata: Metadata = {
  title: 'Demander le changement de puissance du projet - Potentiel',
  description: 'Formulaire de demande de changement de puissance du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Puissance.EnregistrerChangementPuissanceUseCase>(
        'Lauréat.Puissance.UseCase.EnregistrerChangement',
      );
      utilisateur.rôle.peutExécuterMessage<Lauréat.Puissance.DemanderChangementUseCase>(
        'Lauréat.Puissance.UseCase.DemanderChangement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const puissance = await getPuissanceInfos(identifiantProjet.formatter());

      if (puissance.aUneDemandeEnCours && puissance.dateDernièreDemande) {
        return (
          <DemandeEnCoursPage
            title="Demande de changement de puissance"
            href={Routes.Puissance.changement.détails(
              identifiantProjet.formatter(),
              puissance.dateDernièreDemande.formatter(),
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
    }),
  );
}
