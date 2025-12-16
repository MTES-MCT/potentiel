import { mediator } from 'mediateur';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkLauréatSansAbandonOuAchèvement } from '../../../../_helpers/checkLauréatSansAbandonOuAchèvement';
import { Section } from '../../../(components)/Section';
import { getCahierDesCharges } from '../../../../../../_helpers';

import { InstallationDétails, InstallationDétailsProps } from './InstallationDétails';

type InstallationSectionProps = {
  identifiantProjet: string;
};

export const InstallationSection = ({
  identifiantProjet: identifiantProjetValue,
}: InstallationSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const estUnLauréatSansAbandonOuAchèvement =
      await checkLauréatSansAbandonOuAchèvement(identifiantProjet);
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

    const { installateur, typologieInstallation, dispositifDeStockage } = projection;

    return (
      <InstallationDétails
        dispositifDeStockage={getDispositifDeStockage(
          dispositifDeStockage,
          !!champSupplémentaireDispositifDeStockage,
          rôle,
          identifiantProjet,
          estUnLauréatSansAbandonOuAchèvement,
          !!cahierDesCharges.getRèglesChangements('dispositifDeStockage').informationEnregistrée,
        )}
        installateur={getInstallateur(
          installateur,
          !!champSupplémentaireInstallateur,
          rôle,
          identifiantProjet,
          estUnLauréatSansAbandonOuAchèvement,
          !!cahierDesCharges.getRèglesChangements('installateur').informationEnregistrée,
        )}
        typologieInstallation={getTypologieInstallation(
          typologieInstallation,
          rôle,
          identifiantProjet,
        )}
      />
    );
  });

const getInstallateur = (
  installateur: string,
  champSupplémentaireInstallateur: boolean,
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
  estUnLauréatSansAbandonOuAchèvement: boolean,
  règlesChangementInformationEnregistrée: boolean,
): InstallationDétailsProps['installateur'] => {
  if (!champSupplémentaireInstallateur) {
    return undefined;
  }

  const data: InstallationDétailsProps['installateur'] = { value: installateur };

  if (rôle.aLaPermission('installation.installateur.modifier')) {
    data.action = {
      url: Routes.Installation.modifierInstallateur(identifiantProjet.formatter()),
      label: "Modifier l'installateur",
    };
  } else if (
    rôle.aLaPermission('installation.installateur.enregistrerChangement') &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementInformationEnregistrée
  ) {
    data.action = {
      url: Routes.Installation.changement.installateur.enregistrer(identifiantProjet.formatter()),
      label: "Changer l'installateur",
    };
  }

  return data;
};

const getDispositifDeStockage = (
  dispositifDeStockage: Lauréat.Installation.DispositifDeStockage.ValueType | undefined,
  champSupplémentaireDispositifDeStockage: boolean,
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
  estUnLauréatSansAbandonOuAchèvement: boolean,
  règlesChangementInformationEnregistrée: boolean,
): InstallationDétailsProps['dispositifDeStockage'] => {
  if (!champSupplémentaireDispositifDeStockage) {
    return undefined;
  }

  const data: InstallationDétailsProps['dispositifDeStockage'] = {
    value: dispositifDeStockage ? mapToPlainObject(dispositifDeStockage) : undefined,
  };

  if (rôle.aLaPermission('installation.dispositifDeStockage.modifier')) {
    data.action = {
      url: Routes.Installation.modifierDispositifDeStockage(identifiantProjet.formatter()),
      label: 'Modifier le dispositif de stockage',
    };
  } else if (
    rôle.aLaPermission('installation.dispositifDeStockage.enregistrerChangement') &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementInformationEnregistrée
  ) {
    data.action = {
      url: Routes.Installation.changement.dispositifDeStockage.enregistrer(
        identifiantProjet.formatter(),
      ),
      label: 'Changer le dispositif de stockage',
    };
  }

  return data;
};

const getTypologieInstallation = (
  typologieInstallation: Candidature.TypologieInstallation.ValueType[],
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
): InstallationDétailsProps['typologieInstallation'] => ({
  value: mapToPlainObject(typologieInstallation),
  action: rôle.aLaPermission('installation.typologieInstallation.modifier')
    ? {
        url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
        label: 'Modifier la typologie du projet',
      }
    : undefined,
});
