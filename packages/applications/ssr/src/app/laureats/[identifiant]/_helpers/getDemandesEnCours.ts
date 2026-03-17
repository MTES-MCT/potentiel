import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import {
  getAbandonInfos,
  getActionnaireInfos,
  getDemandeDélaiEnCoursInfos,
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from './getLauréat';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  utilisateur: Utilisateur.ValueType;
};

type DemandesEnCours = Array<{ text: string; href: string }>;

export const getDemandesEnCours = async ({
  identifiantProjet,
  utilisateur,
}: Props): Promise<DemandesEnCours> => {
  const demandes: DemandesEnCours = [];

  if (utilisateur.rôle.aLaPermission('puissance.consulterChangement')) {
    const puissance = await getPuissanceInfos(identifiantProjet.formatter());

    if (puissance.aUneDemandeEnCours) {
      demandes.push({
        text: 'Puissance',
        href: Routes.Puissance.changement.détailsPourRedirection(identifiantProjet.formatter()),
      });
    }
  }

  if (utilisateur.rôle.aLaPermission('actionnaire.consulterChangement')) {
    const actionnaire = await getActionnaireInfos(identifiantProjet.formatter());

    if (actionnaire.aUneDemandeEnCours) {
      demandes.push({
        text: 'Actionnaire(s)',
        href: Routes.Actionnaire.changement.détailsPourRedirection(identifiantProjet.formatter()),
      });
    }
  }

  if (utilisateur.rôle.aLaPermission('représentantLégal.consulterChangement')) {
    const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());
    if (représentantLégal.aUneDemandeEnCours) {
      demandes.push({
        text: 'Représentant Légal',
        href: Routes.ReprésentantLégal.changement.détailsPourRedirection(
          identifiantProjet.formatter(),
        ),
      });
    }
  }

  if (utilisateur.rôle.aLaPermission('abandon.consulter.demande')) {
    const abandon = await getAbandonInfos(identifiantProjet.formatter());
    if (abandon?.demandeEnCours) {
      demandes.push({
        text: 'Abandon',
        href: Routes.Abandon.détailRedirection(identifiantProjet.formatter()),
      });
    }
  }

  if (utilisateur.rôle.aLaPermission('délai.listerDemandes')) {
    const délai = await getDemandeDélaiEnCoursInfos(
      identifiantProjet.formatter(),
      utilisateur.identifiantUtilisateur.email,
    );

    if (délai) {
      demandes.push({
        text: 'Délai',
        href: Routes.Délai.détail(identifiantProjet.formatter(), délai.demandéLe.formatter()),
      });
    }
  }

  return demandes;
};
