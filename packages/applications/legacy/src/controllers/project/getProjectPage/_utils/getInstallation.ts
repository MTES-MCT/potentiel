import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';

export type GetInstallationForProjectPage = {
  installateur: {
    value: string;
    affichage?: {
      labelActions?: string;
      label: string;
      url: string;
    };
  };
  typologieInstallation: { value: Candidature.TypologieInstallation.RawType[] };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
};

export const getInstallation = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetInstallationForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const installationProjection =
      await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallation',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(installationProjection)) {
      const { installateur, typologieInstallation } = installationProjection;

      return {
        installateur: {
          value: installateur,
          ...(role.aLaPermission('installation.installateur.modifier') && {
            affichage: {
              url: Routes.Installateur.modifier(identifiantProjet.formatter()),
              label: 'Modifier',
              labelActions: "Modifier l'installateur",
            },
          }),
        },
        typologieInstallation: {
          value: typologieInstallation.map((typologie) => typologie.formatter()),
        },
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
