import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';

import { Section } from '../../../(components)/Section';
import { getCahierDesCharges } from '../../../../../../_helpers';

import { InstallationDétails } from './InstallationDétails';

type InstallationSectionProps = {
  identifiantProjet: string;
};

export const InstallationSection = ({
  identifiantProjet: identifiantProjetValue,
}: InstallationSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const {
      installateur: champSupplémentaireInstallateur,
      dispositifDeStockage: champSupplémentaireDispositifDeStockage,
      typologieInstallation: champsSupplémentaireTypologieInstallation,
    } = cahierDesCharges.getChampsSupplémentaires();

    if (
      !champSupplémentaireInstallateur &&
      !champSupplémentaireDispositifDeStockage &&
      !champsSupplémentaireTypologieInstallation
    ) {
      return null;
    }

    const projection = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
      type: 'Lauréat.Installation.Query.ConsulterInstallation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isNone(projection)) {
      return (
        <Section title="Installation">
          <span>Champs non renseignés</span>
        </Section>
      );
    }

    const actionDispositifDeStockage = await getAction({
      identifiantProjet,
      rôle,
      domain: 'dispositifDeStockage',
      modifier: {
        url: Routes.Installation.modifierDispositifDeStockage(identifiantProjet.formatter()),
        label: 'Modifier le dispositif de stockage',
        labelActions: 'Modifier le dispositif de stockage',
        permission: 'installation.dispositifDeStockage.modifier',
      },
      enregistrerChangement: {
        url: Routes.Installation.changement.installateur.enregistrer(identifiantProjet.formatter()),
        label: 'Changer le dispositif de stockage',
        labelActions: 'Changer le dispositif de stockage',
        permission: 'installation.installateur.enregistrerChangement',
      },
      demanderChangement: undefined,
    });

    const actionInstallateur = await getAction({
      identifiantProjet,
      rôle,
      domain: 'installateur',
      modifier: {
        url: Routes.Installation.modifierInstallateur(identifiantProjet.formatter()),
        label: "Modifier l'installateur",
        labelActions: "Modifier l'installateur",
        permission: 'installation.installateur.modifier',
      },
      enregistrerChangement: {
        url: Routes.Installation.changement.installateur.enregistrer(identifiantProjet.formatter()),
        label: "Changer l'installateur",
        labelActions: "Changer l'installateur",
        permission: 'installation.installateur.enregistrerChangement',
      },
      demanderChangement: undefined,
    });

    const actionTypologieInstallation = rôle.aLaPermission(
      'installation.typologieInstallation.modifier',
    )
      ? {
          url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
          label: 'Modifier la typologie du projet',
        }
      : undefined;

    const { installateur, typologieInstallation, dispositifDeStockage } = projection;

    return (
      <InstallationDétails
        dispositifDeStockage={{
          value: mapToPlainObject(dispositifDeStockage),
          action: actionDispositifDeStockage,
        }}
        installateur={{
          value: mapToPlainObject(installateur),
          action: actionInstallateur,
        }}
        typologieInstallation={{
          value: mapToPlainObject(typologieInstallation),
          action: actionTypologieInstallation,
        }}
      />
    );
  });
