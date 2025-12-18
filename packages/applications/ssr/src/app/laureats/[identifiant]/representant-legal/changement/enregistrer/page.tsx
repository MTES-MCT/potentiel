import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '../../../../../_helpers';

import { EnregistrerChangementReprésentantLégalPage } from './EnregistrerChangementReprésentantLégal.page';
import { getReprésentantLégalInfos } from '../../../_helpers';
import { DemandeEnCoursPage } from '../../../(détails)/(components)/DemandeEnCours.page';
import { Routes } from '@potentiel-applications/routes';

export const metadata: Metadata = {
  title: 'Déclarer le changement de représentant légal du projet - Potentiel',
  description: "Formulaire de déclaration de changement de représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

  await vérifierQueLeCahierDesChargesPermetUnChangement(
    identifiantProjet,
    'information-enregistrée',
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
    <EnregistrerChangementReprésentantLégalPage identifiantProjet={identifiantProjet.formatter()} />
  ));
}
