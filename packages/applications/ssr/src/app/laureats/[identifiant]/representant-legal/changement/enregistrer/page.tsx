import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { EnregistrerChangementReprésentantLégalPage } from './EnregistrerChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Déclarer le changement de représentant légal du projet - Potentiel',
  description: "Formulaire de déclarer de changement de représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => (
    <EnregistrerChangementReprésentantLégalPage
      identifiantProjet={IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter()}
    />
  ));
}
