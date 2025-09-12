import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';

export type GetInstallationAvecDispositifDeStockageForProjectPage = {
  installationAvecDispositifDeStockage: boolean | undefined;
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

    if (!role.aLaPermission('installationAvecDispositifDeStockage.consulter')) {
      return undefined;
    }

    const installationAvecDispositifDeStockageProjection =
      await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageQuery>(
        {
          type: 'Lauréat.InstallationAvecDispositifDeStockage.Query.ConsulterInstallationAvecDispositifDeStockage',
          data: { identifiantProjet: identifiantProjet.formatter() },
        },
      );

    if (Option.isSome(installationAvecDispositifDeStockageProjection)) {
      const { installationAvecDispositifDeStockage } =
        installationAvecDispositifDeStockageProjection;

      if (role.aLaPermission('installationAvecDispositifDeStockage.modifier')) {
        return {
          installationAvecDispositifDeStockage,
          affichage: {
            url: Routes.InstallationAvecDispositifDeStockage.modifier(
              identifiantProjet.formatter(),
            ),
            label: 'Modifier',
            labelActions: "Modifier l'installation avec dispositif de stockage",
          },
        };
      }

      return {
        installationAvecDispositifDeStockage,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
