import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderChangementReprésentantLégalPage } from '@/components/pages/représentant-légal/demande-changement/demander/DemanderChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Demander le changement de représentant légal du projet - Potentiel',
  description: "Formulaire de demande de changement de représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => (
    <DemanderChangementReprésentantLégalPage
      identifiantProjet={IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter()}
    />
  ));
}
