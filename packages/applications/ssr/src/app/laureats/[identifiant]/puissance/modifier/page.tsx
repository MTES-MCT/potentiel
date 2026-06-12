import type { Metadata } from 'next';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPuissanceInfos } from '../../_helpers/getLauréat';
import { ModifierPuissancePage } from './ModifierPuissance.page';

export const metadata: Metadata = { title: 'Modifier la puissance' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Puissance.ModifierPuissanceUseCase>(
        'Lauréat.Puissance.UseCase.ModifierPuissance',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const puissance = await getPuissanceInfos(identifiantProjet.formatter());
      const infosCahierDesChargesPuissanceDeSite = (
        await getCahierDesCharges(identifiantProjet.formatter())
      ).getChampsSupplémentaires().puissanceDeSite;

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

      return (
        <ModifierPuissancePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          puissance={puissance.puissance}
          puissanceDeSite={puissance.puissanceDeSite}
          infosCahierDesChargesPuissanceDeSite={infosCahierDesChargesPuissanceDeSite}
          unitéPuissance={mapToPlainObject(puissance.unitéPuissance)}
        />
      );
    }),
  );
}
