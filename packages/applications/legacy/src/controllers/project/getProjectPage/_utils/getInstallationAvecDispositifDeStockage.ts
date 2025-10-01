import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';

export type GetInstallationAvecDispositifDeStockageForProjectPage = {
  dispositifDeStockage: Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType;
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

export const getInstallationAvecDispositifDeStockage = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetInstallationAvecDispositifDeStockageForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    if (!role.aLaPermission('dispositifDeStockage.consulter')) {
      return undefined;
    }

    const dispositifDeStockageProjection =
      await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageQuery>(
        {
          type: 'Lauréat.InstallationAvecDispositifDeStockage.Query.ConsulterInstallationAvecDispositifDeStockage',
          data: { identifiantProjet: identifiantProjet.formatter() },
        },
      );

    if (Option.isSome(dispositifDeStockageProjection)) {
      const { dispositifDeStockage } = dispositifDeStockageProjection;

      if (role.aLaPermission('dispositifDeStockage.modifier')) {
        return {
          dispositifDeStockage,
          affichage: {
            url: Routes.InstallationAvecDispositifDeStockage.modifier(
              identifiantProjet.formatter(),
            ),
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
