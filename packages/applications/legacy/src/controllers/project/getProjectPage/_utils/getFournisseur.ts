import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { mediator } from 'mediateur';

export type GetFournisseurForProjectPage = Pick<
  Lauréat.Fournisseur.ConsulterFournisseurReadModel,
  'fournisseurs' | 'évaluationCarboneSimplifiée'
> & {
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

export const getFournisseur = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetFournisseurForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    if (Option.isSome(fournisseur)) {
      const { fournisseurs, évaluationCarboneSimplifiée } = fournisseur;
      return {
        fournisseurs,
        évaluationCarboneSimplifiée,
        affichage:
          role.aLaPermission('fournisseur.enregistrerChangement') &&
          !aUnAbandonEnCours &&
          !estAbandonné &&
          !estAchevé
            ? {
                url: Routes.Fournisseur.changement.enregistrer(identifiantProjet.formatter()),
                label: 'Changer de fournisseur',
                labelActions: 'Changer de fournisseur',
              }
            : undefined,
      };
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(candidature)) {
      return {
        fournisseurs: candidature.fournisseurs,
        évaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
        affichage: role.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
