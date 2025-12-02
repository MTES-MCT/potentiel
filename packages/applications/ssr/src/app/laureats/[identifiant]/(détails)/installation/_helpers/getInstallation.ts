import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getCahierDesCharges } from '../../../../../_helpers';
import { checkLauréatSansAbandonOuAchèvement } from '../../../_helpers/checkLauréatSansAbandonOuAchèvement';
import { ChampsAvecAction } from '../../../_helpers/types';
import { getLauréatInfos } from '../../../_helpers/getLauréat';
import { checkAutorisationChangement } from '../../../_helpers/checkAutorisationChangement';

export type GetInstallationForProjectPage = {
  typologieInstallation?: ChampsAvecAction<Candidature.TypologieInstallation.RawType[]>;
  installateur?: ChampsAvecAction<string>;
  dispositifDeStockage?: ChampsAvecAction<Lauréat.Installation.DispositifDeStockage.RawType>;
  natureDeLExploitation?: ChampsAvecAction<{
    typeNatureDeLExploitation: Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.RawType;
    tauxPrévisionnelACI?: number;
  }>;
  autorisationDUrbanisme?: ChampsAvecAction<Candidature.Dépôt.RawType['autorisationDUrbanisme']>;
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

  const {
    installateur: champSupplémentaireInstallateur,
    dispositifDeStockage: champSupplémentaireDispositifDeStockage,
    natureDeLExploitation: champsSupplémentaireNatureDeLExploitation,
    autorisationDUrbanisme: champsSupplémentaireAutorisationDUrbanisme,
  } = cahierDesCharges.getChampsSupplémentaires();

  const data: GetInstallationForProjectPage = {};

  if (champsSupplémentaireAutorisationDUrbanisme) {
    const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });
    data.autorisationDUrbanisme = {
      value: lauréat.autorisationDUrbanisme
        ? {
            numéro: lauréat.autorisationDUrbanisme.numéro,
            date: lauréat.autorisationDUrbanisme.date.formatter(),
          }
        : 'Champs non renseigné',
    };
  }

  if (champsSupplémentaireNatureDeLExploitation) {
    data.natureDeLExploitation = await getNatureDeLExploitation(
      rôle,
      identifiantProjet,
      cahierDesCharges.getRèglesChangements('natureDeLExploitation'),
    );
  }

  const installationProjection =
    await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
      type: 'Lauréat.Installation.Query.ConsulterInstallation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

  if (Option.isNone(installationProjection)) {
    return data;
  }

  const { installateur, typologieInstallation, dispositifDeStockage } = installationProjection;

  data.typologieInstallation = getTypologieInstallation(
    typologieInstallation,
    rôle,
    identifiantProjet,
  );
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

const getNatureDeLExploitation = async (
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['natureDeLExploitation'],
): Promise<GetInstallationForProjectPage['natureDeLExploitation']> => {
  const projection =
    await mediator.send<Lauréat.NatureDeLExploitation.ConsulterNatureDeLExploitationQuery>({
      type: 'Lauréat.NatureDeLExploitation.Query.ConsulterNatureDeLExploitation',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

  if (Option.isSome(projection)) {
    const { peutModifier, peutEnregistrerChangement } =
      await checkAutorisationChangement<'natureDeLExploitation'>({
        identifiantProjet,
        rôle,
        règlesChangementPourAppelOffres,
        domain: 'natureDeLExploitation',
      });

    const action = peutModifier
      ? {
          url: Routes.NatureDeLExploitation.modifier(identifiantProjet.formatter()),
          label: 'Modifier',
          labelActions: "Modifier la nature de l'exploitation",
        }
      : peutEnregistrerChangement
        ? {
            url: Routes.NatureDeLExploitation.changement.enregistrer(identifiantProjet.formatter()),
            label: "Changer la nature de l'exploitation",
            labelActions: "Changer la nature de l'exploitation",
          }
        : undefined;

    return {
      value: {
        typeNatureDeLExploitation:
          projection.natureDeLExploitation.typeNatureDeLExploitation.formatter(),
        tauxPrévisionnelACI: projection.natureDeLExploitation.tauxPrévisionnelACI,
      },
      action,
    };
  }
};

const getInstallateur = (
  installateur: string,
  champSupplémentaireInstallateur: boolean,
  rôle: Role.ValueType,
  identifiantProjet: IdentifiantProjet.ValueType,
  estUnLauréatSansAbandonOuAchèvement: boolean,
  règlesChangementInformationEnregistrée: boolean,
): ChampsAvecAction<string> | undefined => {
  if (!champSupplémentaireInstallateur) {
    return undefined;
  }

  const value = installateur !== '' ? installateur : 'Champs non renseigné';
  const data: ChampsAvecAction<string> = { value };

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
): ChampsAvecAction<Lauréat.Installation.DispositifDeStockage.RawType> | undefined => {
  if (!champSupplémentaireDispositifDeStockage) {
    return undefined;
  }

  const data: ChampsAvecAction<Lauréat.Installation.DispositifDeStockage.RawType> = {
    value: dispositifDeStockage ? dispositifDeStockage.formatter() : 'Champs non renseigné',
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
): ChampsAvecAction<Candidature.TypologieInstallation.RawType[]> => {
  const value = typologieInstallation.length
    ? typologieInstallation.map((typologie) => typologie.formatter())
    : 'Champs non renseigné';

  const data: ChampsAvecAction<Candidature.TypologieInstallation.RawType[]> = { value };

  if (rôle.aLaPermission('installation.typologieInstallation.modifier')) {
    data.action = {
      url: Routes.Installation.modifierTypologie(identifiantProjet.formatter()),
      label: 'Modifier la typologie du projet',
    };
  }

  return data;
};
