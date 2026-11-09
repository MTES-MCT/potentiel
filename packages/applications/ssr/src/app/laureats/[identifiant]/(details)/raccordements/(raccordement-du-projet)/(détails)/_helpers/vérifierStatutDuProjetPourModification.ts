import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { getOptionalAbandon } from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const getLauréatOrRedirect = async (identifiantProjet: IdentifiantProjet.RawType) =>
  withUtilisateur(async (utilisateur) => {
    const lauréat = await getLauréatInfos(identifiantProjet);
    const abandon = utilisateur.rôle.aLaPermission('abandon.consulter.enCours')
      ? await getOptionalAbandon(identifiantProjet)
      : undefined;

    return vérifierSiPeutAccéderÀRaccordement(lauréat, abandon)
      ? lauréat
      : redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
  });

export const vérifierSiPeutAccéderÀRaccordement = (
  lauréat: Lauréat.ConsulterLauréatReadModel,
  abandon: Lauréat.Abandon.ConsulterAbandonReadModel | undefined,
): boolean =>
  lauréat.estPartiEnPPA || (!lauréat.statut.estAbandonné() && !abandon?.statut.estEnCours());
