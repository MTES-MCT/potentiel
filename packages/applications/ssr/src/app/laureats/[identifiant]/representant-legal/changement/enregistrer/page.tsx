import type { Metadata } from 'next';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { vérifierQueLeCahierDesChargesPermetUnChangement } from '../../../../../_helpers';
import { getReprésentantLégalInfos } from '../../../_helpers';
import { EnregistrerChangementReprésentantLégalPage } from './EnregistrerChangementReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Déclarer un changement de représentant légal',
};

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

  await vérifierQueLeCahierDesChargesPermetUnChangement(
    identifiantProjet,
    'information-enregistrée',
    'représentantLégal',
  );

  const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());

  if (représentantLégal.dateDernièreDemande && représentantLégal.aUneDemandeEnCours) {
    return (
      <DemandeEnCoursPage
        title="Demande de changement de représentant légal"
        href={Routes.ReprésentantLégal.changement.détails(
          identifiantProjet.formatter(),
          représentantLégal.dateDernièreDemande.formatter(),
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
