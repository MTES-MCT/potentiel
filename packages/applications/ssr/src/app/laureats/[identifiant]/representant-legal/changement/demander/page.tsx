import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '../../../../../_helpers';
import { getReprésentantLégalInfos } from '../../../_helpers';

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

  const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());

  if (représentantLégal.demandeEnCours) {
    return (
      <DemandeEnCoursPage
        title="Demande de changement de représentant légal"
        href={Routes.ReprésentantLégal.changement.détails(
          identifiantProjet.formatter(),
          représentantLégal.demandeEnCours.demandéLe,
        )}
      />
    );
  }

  return PageWithErrorHandling(async () => (
    <DemanderChangementReprésentantLégalPage identifiantProjet={identifiantProjet.formatter()} />
  ));
}
