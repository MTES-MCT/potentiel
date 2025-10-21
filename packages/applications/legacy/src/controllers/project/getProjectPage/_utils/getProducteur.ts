import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { checkAbandonAndAchèvement } from './checkLauréat/checkAbandonAndAchèvement';
import { mediator } from 'mediateur';

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
};

export const getProducteur = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetProducteurForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const producteurProjection = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const { aUnAbandonEnCours, estAbandonné, estAchevé } = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    if (Option.isSome(producteurProjection)) {
      const { producteur } = producteurProjection;

      if (role.aLaPermission('producteur.modifier')) {
        return {
          producteur,
          affichage: {
            url: Routes.Producteur.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier le producteur',
          },
        };
      }

      if (
        role.aLaPermission('producteur.enregistrerChangement') &&
        !aUnAbandonEnCours &&
        !estAbandonné &&
        !estAchevé
      ) {
        return {
          producteur: producteur,
          affichage: {
            url: Routes.Producteur.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Changer de producteur',
            labelActions: 'Changer de producteur',
          },
        };
      }

      return {
        producteur,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
