import { Producteur } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { checkAbandonAndAchèvement } from './checkAbandonAndAchèvement';
import { mediator } from 'mediateur';

export type GetProducteurForProjectPage = {
  producteur: number;
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

    const producteurProjection = await mediator.send<Producteur.ConsulterProducteurQuery>({
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
            url: Routes.Producteur.changement.demander(identifiantProjet.formatter()),
            label: 'Changer de producteur',
          },
        };
      }

      return {
        producteur,
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
        producteur: candidature.nomCandidat,
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
