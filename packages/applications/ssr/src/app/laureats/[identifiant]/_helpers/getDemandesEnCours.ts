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
  const test: DemandesEnCours = [];
  const puissance = await getPuissanceInfos(identifiantProjet.formatter());

  if (
    puissance.aUneDemandeEnCours &&
    utilisateur.rôle.aLaPermission('puissance.consulterChangement')
  ) {
    test.push({
      text: 'Puissance',
      href: Routes.Puissance.changement.détailsPourRedirection(identifiantProjet.formatter()),
    });
  }

  const actionnaire = await getActionnaireInfos(identifiantProjet.formatter());

  if (
    actionnaire.aUneDemandeEnCours &&
    utilisateur.rôle.aLaPermission('actionnaire.consulterChangement')
  ) {
    test.push({
      text: 'Actionnaire(s)',
      href: Routes.Actionnaire.changement.détailsPourRedirection(identifiantProjet.formatter()),
    });
  }

  const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());
  if (
    représentantLégal.aUneDemandeEnCours &&
    utilisateur.rôle.aLaPermission('représentantLégal.consulterChangement')
  ) {
    test.push({
      text: 'Représentant Légal',
      href: Routes.ReprésentantLégal.changement.détailsPourRedirection(
        identifiantProjet.formatter(),
      ),
    });
  }

  const abandon = await getAbandonInfos(identifiantProjet.formatter());
  if (abandon?.demandeEnCours && utilisateur.rôle.aLaPermission('abandon.consulter.demande')) {
    test.push({
      text: 'Abandon',
      href: Routes.Abandon.détailRedirection(identifiantProjet.formatter()),
    });
  }

  const délai = await getDemandeDélaiEnCoursInfos(
    identifiantProjet.formatter(),
    utilisateur.identifiantUtilisateur.email,
  );

  if (délai) {
    test.push({
      text: 'Délai',
      href: Routes.Délai.détail(identifiantProjet.formatter(), délai.demandéLe.formatter()),
    });
  }

  return test;
};
