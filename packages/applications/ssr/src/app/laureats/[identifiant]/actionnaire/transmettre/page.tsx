import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { TransmettreActionnairePage } from '@/components/pages/actionnaire/transmettre/TransmettreActionnaire.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: "Transmettre l'actionnaire du projet - Potentiel",
  description: "Formulaire de transmission de l'actionnaire d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      return (
        <TransmettreActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          hasToUploadDocument={utilisateur.role.estÉgaleÀ(Role.porteur)}
        />
      );
    }),
  );
}
