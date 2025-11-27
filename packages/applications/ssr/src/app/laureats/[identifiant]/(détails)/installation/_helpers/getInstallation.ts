import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '../../../../../_helpers';
import { checkLauréatSansAbandonOuAchèvement } from '../../../_helpers/checkLauréatSansAbandonOuAchèvement';
import { ChampsAvecAffichage } from '../../../_helpers/types';

export type GetInstallationForProjectPage = {
  typologieInstallation: ChampsAvecAffichage<Candidature.TypologieInstallation.RawType[]>;
  installateur?: ChampsAvecAffichage<string>;
  dispositifDeStockage?: ChampsAvecAffichage<Lauréat.Installation.DispositifDeStockage.RawType>;
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getInstallation = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetInstallationForProjectPage> => {
  const estUnLauréatSansAbandonOuAchèvement =
    await checkLauréatSansAbandonOuAchèvement(identifiantProjet);
  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
  const installationProjection =
    await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
      type: 'Lauréat.Installation.Query.ConsulterInstallation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

  if (Option.isNone(installationProjection)) {
    return notFound();
  }

  const { installateur, typologieInstallation, dispositifDeStockage } = installationProjection;
  const {
    installateur: champSupplémentaireInstallateur,
    dispositifDeStockage: champSupplémentaireDispositifDeStockage,
  } = cahierDesCharges.getChampsSupplémentaires();

  const data: GetInstallationForProjectPage = {
    typologieInstallation: getTypologieInstallation(typologieInstallation, rôle, identifiantProjet),
  };

  data.dispositifDeStockage = getDispositifDeStockage(
    dispositifDeStockage,
    !!champSupplémentaireDispositifDeStockage,
    rôle,
    identifiantProjet,
    estUnLauréatSansAbandonOuAchèvement,
    !!cahierDesCharges.getRèglesChangements('dispositifDeStockage').informationEnregistrée,
  );

  data.installateur = getInstallateur(
    installateur,
    !!champSupplémentaireInstallateur,
    rôle,
    identifiantProjet,
    estUnLauréatSansAbandonOuAchèvement,
    !!cahierDesCharges.getRèglesChangements('installateur').informationEnregistrée,
  );

  return data;
};

const getInstallateur = (
  installateur: string,
  champSupplémentaireInstallateur: boolean,
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
  estUnLauréatSansAbandonOuAchèvement: boolean,
  règlesChangementInformationEnregistrée: boolean,
): ChampsAvecAffichage<string> | undefined => {
  if (!champSupplémentaireInstallateur) {
    return undefined;
  }

  const value = installateur !== '' ? installateur : 'Champs non renseigné';
  const data: ChampsAvecAffichage<string> = { value };

  if (rôle.aLaPermission('installation.installateur.modifier')) {
    data.affichage = {
      url: Routes.Installation.modifierInstallateur(identifiantProjet.formatter()),
      label: "Modifier l'installateur",
    };
  } else if (
    rôle.aLaPermission('installation.installateur.enregistrerChangement') &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementInformationEnregistrée
  ) {
    data.affichage = {
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
): ChampsAvecAffichage<Lauréat.Installation.DispositifDeStockage.RawType> | undefined => {
  if (!champSupplémentaireDispositifDeStockage) {
    return undefined;
  }

  const data: ChampsAvecAffichage<Lauréat.Installation.DispositifDeStockage.RawType> = {
    value: dispositifDeStockage ? dispositifDeStockage.formatter() : 'Champs non renseigné',
  };

  if (rôle.aLaPermission('installation.dispositifDeStockage.modifier')) {
    data.affichage = {
      url: Routes.Installation.modifierDispositifDeStockage(identifiantProjet.formatter()),
      label: 'Modifier le dispositif de stockage',
    };
  } else if (
    rôle.aLaPermission('installation.dispositifDeStockage.enregistrerChangement') &&
    estUnLauréatSansAbandonOuAchèvement &&
    règlesChangementInformationEnregistrée
  ) {
    data.affichage = {
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
): ChampsAvecAffichage<Candidature.TypologieInstallation.RawType[]> => {
  const value = typologieInstallation.length
    ? typologieInstallation.map((typologie) => typologie.formatter())
    : 'Champs non renseigné';

  const data: ChampsAvecAffichage<Candidature.TypologieInstallation.RawType[]> = { value };

  if (rôle.aLaPermission('installation.typologieInstallation.modifier')) {
    data.affichage = {
      url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
      label: 'Modifier la typologie du projet',
    };
  }

  return data;
};
