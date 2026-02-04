import { Metadata } from 'next';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '../../../../../_helpers';
import { getReprésentantLégalInfos } from '../../../_helpers';

import { EnregistrerChangementReprésentantLégalPage } from './EnregistrerChangementReprésentantLégal.page';

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

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.ReprésentantLégal.EnregistrerChangementReprésentantLégalUseCase>(
        'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
      );

      return (
        <EnregistrerChangementReprésentantLégalPage
          identifiantProjet={identifiantProjet.formatter()}
        />
      );
    }),
  );
}
