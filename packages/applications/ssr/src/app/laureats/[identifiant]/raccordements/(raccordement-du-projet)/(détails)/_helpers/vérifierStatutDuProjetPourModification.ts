import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { getAbandonInfos } from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const getLauréatOrRedirect = async (identifiantProjet: IdentifiantProjet.RawType) =>
  withUtilisateur(async (utilisateur) => {
    const lauréat = await getLauréatInfos(identifiantProjet);
    const abandon = utilisateur.rôle.aLaPermission('abandon.consulter.enCours')
      ? await getAbandonInfos(identifiantProjet)
      : undefined;

    const peutModifierRaccordement = vérifierSiModificationRaccordementPossible(lauréat, abandon);
    if (!peutModifierRaccordement) {
      return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
    }
    return lauréat;
  });

export const vérifierSiModificationRaccordementPossible = (
  lauréat: Lauréat.ConsulterLauréatReadModel,
  abandon: Lauréat.Abandon.ConsulterAbandonReadModel | undefined,
): boolean => lauréat.estPartiEnPPA || (!lauréat.statut.estAbandonné() && !abandon?.demandeEnCours);
