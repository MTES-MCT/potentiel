import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type GetProducteurForProjectPage = {
  producteur: string;
  affichage?: {
    labelActions?: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  changementProducteurPossibleAvantAchèvement: boolean;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['producteur'];
};

export const getProducteur = async ({
  identifiantProjet,
  rôle,
  changementProducteurPossibleAvantAchèvement,
  règlesChangementPourAppelOffres,
}: Props): Promise<GetProducteurForProjectPage | undefined> => {
  try {
    const producteurProjection = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(producteurProjection)) {
      const { producteur } = producteurProjection;

      const { peutModifier, peutEnregistrerChangement } =
        await checkAutorisationChangement<'producteur'>({
          rôle: Role.convertirEnValueType(rôle),
          identifiantProjet,
          règlesChangementPourAppelOffres,
          domain: 'producteur',
        });

      const affichage = peutModifier
        ? {
            url: Routes.Producteur.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier le producteur',
          }
        : peutEnregistrerChangement
          ? {
              url: Routes.Producteur.changement.enregistrer(identifiantProjet.formatter()),
              label: 'Changer de producteur',
              labelActions: 'Changer de producteur',
            }
          : undefined;

      return {
        producteur,
        affichage,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
