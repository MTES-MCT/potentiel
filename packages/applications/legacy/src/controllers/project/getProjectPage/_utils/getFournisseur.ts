import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';

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
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['fournisseur'];
};

export const getFournisseur = async ({
  identifiantProjet,
  rôle,
  règlesChangementPourAppelOffres,
}: Props): Promise<GetFournisseurForProjectPage | undefined> => {
  try {
    const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(fournisseur)) {
      const { fournisseurs, évaluationCarboneSimplifiée } = fournisseur;

      const { peutModifier, peutEnregistrerChangement } =
        await checkAutorisationChangement<'fournisseur'>({
          rôle: Role.convertirEnValueType(rôle),
          identifiantProjet,
          règlesChangementPourAppelOffres,
          domain: 'fournisseur',
        });

      return {
        fournisseurs,
        évaluationCarboneSimplifiée,
        affichage: peutModifier
          ? {
              url: Routes.Fournisseur.modifier(identifiantProjet.formatter()),
              label: 'Modifier',
              labelActions: 'Modifier le fournisseur',
            }
          : peutEnregistrerChangement
            ? {
                url: Routes.Fournisseur.changement.enregistrer(identifiantProjet.formatter()),
                label: 'Changer de fournisseur',
                labelActions: 'Changer de fournisseur',
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
