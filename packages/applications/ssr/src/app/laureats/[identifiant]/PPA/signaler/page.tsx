import { Metadata } from 'next';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatInfos } from '../../_helpers';

import { SignalerPPAPage } from './SignalerPPA.page';

export const metadata: Metadata = {
  title: 'Signaler un PPA - Potentiel',
  description: "Formulaire de signalement d'un PPA pour un projet lauréat",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.SignalerPPAUseCase>(
        'Lauréat.UseCase.SignalerPPA',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());

      return <SignalerPPAPage identifiantProjet={mapToPlainObject(lauréat.identifiantProjet)} />;
    }),
  );
}
