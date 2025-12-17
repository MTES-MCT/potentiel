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
          <span>Champ non renseignés</span>
        </Section>
      );
    }

    const actionDispositifDeStockage = await getAction({
      identifiantProjet,
      rôle,
      domain: 'dispositifDeStockage',
    });

    const actionInstallateur = await getAction({
      identifiantProjet,
      rôle,
      domain: 'installateur',
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
