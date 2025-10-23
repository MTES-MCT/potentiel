import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type GetInstallationForProjectPage = {
  installateur?: {
    value: string;
    affichage?: {
      labelActions?: string;
      label: string;
      url: string;
    };
  };
  typologieInstallation: {
    value: Candidature.TypologieInstallation.RawType[];
    affichage?: {
      labelActions?: string;
      label: string;
      url: string;
    };
  };
  dispositifDeStockage?: {
    value?: Lauréat.Installation.DispositifDeStockage.RawType;
    affichage?: {
      labelActions?: string;
      label: string;
      url: string;
    };
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  champsSupplémentairesCahierDesCharges: AppelOffre.ChampsSupplémentairesCandidature;
};

export const getInstallation = async ({
  identifiantProjet,
  rôle,
  champsSupplémentairesCahierDesCharges,
}: Props): Promise<GetInstallationForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const installationProjection =
      await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallation',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

    if (Option.isSome(installationProjection)) {
      const { installateur, typologieInstallation, dispositifDeStockage } = installationProjection;
      const {
        installateur: champSupplémentaireInstallateur,
        dispositifDeStockage: champSupplémentaireDispositifDeStockage,
      } = champsSupplémentairesCahierDesCharges;

      const data: GetInstallationForProjectPage = {
        typologieInstallation: {
          value: typologieInstallation.map((typologie) => typologie.formatter()),
        },
      };
      if (role.aLaPermission('installation.typologieInstallation.modifier')) {
        data.typologieInstallation.affichage = {
          url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
          label: 'Modifier',
          labelActions: 'Modifier la typologie du projet',
        };
      }

      if (champSupplémentaireDispositifDeStockage) {
        data.dispositifDeStockage = {
          value: dispositifDeStockage ? dispositifDeStockage.formatter() : undefined,
        };
        if (role.aLaPermission('installation.dispositifDeStockage.modifier')) {
          data.dispositifDeStockage.affichage = {
            url: Routes.Installation.modifierDispositifDeStockage(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier le dispositif de stockage',
          };
        }
      }

      if (champSupplémentaireInstallateur) {
        data.installateur = { value: installateur };
        if (role.aLaPermission('installation.installateur.modifier')) {
          data.installateur.affichage = {
            url: Routes.Installation.modifierInstallateur(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: "Modifier l'installateur",
          };
        }
      }

      return data;
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
