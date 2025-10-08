import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';

export type GetInstallateurForProjectPage = {
  installateur: string;
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

export const getInstallateur = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetInstallateurForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const installateurProjection =
      await mediator.send<Lauréat.Installation.ConsulterInstallateurQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallateur',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(installateurProjection)) {
      const { installateur } = installateurProjection;

      if (role.aLaPermission('installation.modifier')) {
        return {
          installateur,
          affichage: {
            url: Routes.Installateur.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: "Modifier l'installateur",
          },
        };
      }

      return {
        installateur,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
