import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { checkAbandonAndAchèvement } from './checkLauréat/checkAbandonAndAchèvement';
import { récupérerChangementsPermisParLeCahierDesCharges } from './cahierDesCharges/récupérerChangementsPermisParLeCahierDesCharges';

export type GetReprésentantLégalForProjectPage = {
  nom: string;
  affichage?: {
    labelActions?: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
};

export const getReprésentantLégal = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetReprésentantLégalForProjectPage | undefined> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const représentantLégal =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isNone(représentantLégal)) {
      return undefined;
    }

    const demandeEnCours = utilisateur.aLaPermission('représentantLégal.consulterChangement')
      ? await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>(
          {
            type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          },
        )
      : Option.none;

    const demandeChangementExistante = Option.isSome(demandeEnCours);

    if (demandeChangementExistante) {
      return {
        nom: représentantLégal.nomReprésentantLégal,
        affichage: utilisateur.aLaPermission('représentantLégal.consulterChangement')
          ? {
              url: Routes.ReprésentantLégal.changement.détails(
                identifiantProjet.formatter(),
                demandeEnCours.demandéLe.formatter(),
              ),
              label: 'Voir la demande de modification',
              labelActions: 'Demande de modification de représentant légal',
            }
          : undefined,
      };
    }

    if (utilisateur.aLaPermission('représentantLégal.modifier')) {
      return {
        nom: représentantLégal.nomReprésentantLégal,
        affichage: {
          url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
          label: 'Modifier',
          labelActions: 'Modifier le représentant légal',
        },
      };
    }

    const { demandeEstPossible, informationEnregistréeEstPossible } =
      await récupérerChangementsPermisParLeCahierDesCharges(identifiantProjet, 'représentantLégal');

    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    if (
      aUnAbandonEnCours ||
      estAbandonné ||
      estAchevé ||
      (!demandeEstPossible && !informationEnregistréeEstPossible)
    ) {
      return undefined;
    }

    if (utilisateur.aLaPermission('représentantLégal.demanderChangement') && demandeEstPossible) {
      return {
        nom: représentantLégal.nomReprésentantLégal,
        affichage: {
          url: Routes.ReprésentantLégal.changement.demander(identifiantProjet.formatter()),
          label: 'Changer de représentant légal',
          labelActions: 'Changer de représentant légal',
        },
      };
    }

    if (
      utilisateur.aLaPermission('représentantLégal.enregistrerChangement') &&
      informationEnregistréeEstPossible
    ) {
      return {
        nom: représentantLégal.nomReprésentantLégal,
        affichage: {
          url: Routes.ReprésentantLégal.changement.enregistrer(identifiantProjet.formatter()),
          label: 'Changer de représentant légal',
          labelActions: 'Changer de représentant légal',
        },
      };
    }

    return undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getReprésentantLégal').error(error);
    return undefined;
  }
};
