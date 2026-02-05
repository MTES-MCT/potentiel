import { Metadata } from 'next';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import {
  getCahierDesChargesPuissanceDeSiteInfos,
  getPuissanceInfos,
} from '../../_helpers/getLauréat';

import { ModifierPuissancePage } from './ModifierPuissance.page';

export const metadata: Metadata = {
  title: 'Changement de puissance du projet - Potentiel',
  description: "Formulaire de changement de puissance d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Puissance.ModifierPuissanceUseCase>(
        'Lauréat.Puissance.UseCase.ModifierPuissance',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const puissance = await getPuissanceInfos(identifiantProjet.formatter());
      const infosCahierDesChargesPuissanceDeSite = await getCahierDesChargesPuissanceDeSiteInfos(
        identifiantProjet.formatter(),
      );

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
