import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';

export type GetDispositifDeStockageForProjectPage = {
  dispositifDeStockage: Lauréat.DispositifDeStockage.DispositifDeStockage.RawType;
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

export const getDispositifDeStockage = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetDispositifDeStockageForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    if (!role.aLaPermission('dispositifDeStockage.consulter')) {
      return undefined;
    }

    const dispositifDeStockageProjection =
      await mediator.send<Lauréat.DispositifDeStockage.ConsulterDispositifDeStockageQuery>({
        type: 'Lauréat.DispositifDeStockage.Query.ConsulterDispositifDeStockage',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(dispositifDeStockageProjection)) {
      const { dispositifDeStockage } = dispositifDeStockageProjection;

      if (role.aLaPermission('dispositifDeStockage.modifier')) {
        return {
          dispositifDeStockage,
          affichage: {
            url: Routes.DispositifDeStockage.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier dispositif de stockage',
          },
        };
      }

      return {
        dispositifDeStockage,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
