import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '../../../../../_helpers';

import { DemanderChangementReprésentantLégalPage } from './DemanderChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Demander le changement de représentant légal du projet - Potentiel',
  description: "Formulaire de demande de changement de représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

  await vérifierQueLeCahierDesChargesPermetUnChangement(
    identifiantProjet,
    'demande',
    'représentantLégal',
  );

  return PageWithErrorHandling(async () => (
    <DemanderChangementReprésentantLégalPage identifiantProjet={identifiantProjet.formatter()} />
  ));
}
