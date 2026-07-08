import type { Metadata } from 'next';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges, getCandidature } from '@/app/_helpers';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPuissanceInfos } from '../../../_helpers/getLauréat';
import { DemanderChangementPuissancePage } from './DemanderChangementPuissance.page';

export const metadata: Metadata = { title: 'Demander le changement de puissance' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

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

      const candidature = await getCandidature(identifiantProjet.formatter());

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

      return (
        <DemanderChangementPuissancePage
          identifiantProjet={mapToPlainObject(puissance.identifiantProjet)}
          puissance={puissance.puissance}
          puissanceDeSite={puissance.puissanceDeSite}
          unitéPuissance={mapToPlainObject(puissance.unitéPuissance)}
          cahierDesCharges={mapToPlainObject(cahierDesCharges)}
          puissanceInitiale={puissance.puissanceInitiale}
          infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
          estDansLeVolumeRéservé={candidature.instruction.volumeRéservé}
        />
      );
    }),
  );
}
