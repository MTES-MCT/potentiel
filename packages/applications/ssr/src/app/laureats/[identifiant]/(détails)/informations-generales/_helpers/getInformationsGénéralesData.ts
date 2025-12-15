import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

import { ChampObligatoireAvecAction } from '../../../_helpers/types';
import { checkAutorisationChangement } from '../../../_helpers/checkAutorisationChangement';
import { getLauréatInfos } from '../../../_helpers/getLauréat';

export type GetProducteurData = ChampObligatoireAvecAction<{
  producteur: string;
}>;

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getProducteurData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetProducteurData> => {
  const projection = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
    type: 'Lauréat.Producteur.Query.ConsulterProducteur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const { producteur } = projection;

  const { peutModifier, peutEnregistrerChangement } =
    await checkAutorisationChangement<'producteur'>({
      identifiantProjet,
      rôle,
      domain: 'producteur',
    });

  const action = peutModifier
    ? {
        url: Routes.Producteur.modifier(identifiantProjet.formatter()),
        label: 'Modifier',
        labelActions: 'Modifier le producteur',
      }
    : peutEnregistrerChangement
      ? {
          url: Routes.Producteur.changement.enregistrer(identifiantProjet.formatter()),
          label: 'Changer de producteur',
          labelActions: 'Changer de producteur',
        }
      : undefined;

  return {
    value: { producteur },
    action,
  };
};

export type GetReprésentantLégalData = ChampObligatoireAvecAction<{
  nom: string;
}>;

export const getReprésentantLégalData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetReprésentantLégalData> => {
  const projection = await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>(
    {
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
      data: { identifiantProjet: identifiantProjet.formatter() },
    },
  );

  if (Option.isNone(projection)) {
    return notFound();
  }

  const value = { nom: projection.nomReprésentantLégal };

  if (projection.demandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('représentantLégal.consulterChangement')
        ? {
            url: Routes.ReprésentantLégal.changement.détails(
              identifiantProjet.formatter(),
              projection.demandeEnCours.demandéLe,
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  const { peutModifier, peutFaireUneDemandeDeChangement, peutEnregistrerChangement } =
    await checkAutorisationChangement<'représentantLégal'>({
      identifiantProjet,
      rôle,
      domain: 'représentantLégal',
    });

  const action = peutModifier
    ? {
        url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
        label: 'Modifier',
        labelActions: 'Modifier le représentant légal',
      }
    : peutFaireUneDemandeDeChangement || peutEnregistrerChangement
      ? {
          url: peutFaireUneDemandeDeChangement
            ? Routes.ReprésentantLégal.changement.demander(identifiantProjet.formatter())
            : Routes.ReprésentantLégal.changement.enregistrer(identifiantProjet.formatter()),
          label: 'Changer de représentant légal',
          labelActions: 'Changer de représentant légal',
        }
      : undefined;

  return {
    value,
    action,
  };
};

export type GetPuissanceData = ChampObligatoireAvecAction<{
  puissance: number;
  unitéPuissance: string;
  puissanceDeSite?: number;
}>;

export const getPuissanceData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetPuissanceData> => {
  const projection = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const { puissance, dateDemandeEnCours, puissanceDeSite, unitéPuissance } = projection;
  const value = {
    puissance,
    unitéPuissance: unitéPuissance.formatter(),
    puissanceDeSite,
  };

  if (dateDemandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('puissance.consulterChangement')
        ? {
            url: Routes.Puissance.changement.détails(
              identifiantProjet.formatter(),
              dateDemandeEnCours.formatter(),
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  const { peutModifier, peutFaireUneDemandeDeChangement } =
    await checkAutorisationChangement<'puissance'>({
      identifiantProjet,
      rôle,
      domain: 'puissance',
    });

  const action = peutModifier
    ? {
        url: Routes.Puissance.modifier(identifiantProjet.formatter()),
        label: 'Modifier',
      }
    : peutFaireUneDemandeDeChangement
      ? {
          url: Routes.Puissance.changement.demander(identifiantProjet.formatter()),
          label: 'Changer de puissance',
        }
      : undefined;

  return {
    value,
    action,
  };
};

export type GetLauréatData = {
  siteDeProduction: ChampObligatoireAvecAction<PlainType<Candidature.Localité.ValueType>>;
  prixRéférence: number;
  emailContact: string;
  actionnariat?: PlainType<Candidature.TypeActionnariat.ValueType>;
  coefficientKChoisi?: boolean;
};

export const getLauréatData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetLauréatData> => {
  const lauréat = await getLauréatInfos(identifiantProjet.formatter());

  return {
    siteDeProduction: {
      value: mapToPlainObject(lauréat.localité),
      action: rôle.aLaPermission('lauréat.modifierSiteDeProduction')
        ? {
            url: Routes.Lauréat.modifierSiteDeProduction(identifiantProjet.formatter()),
            label: 'Modifier',
          }
        : undefined,
    },
    coefficientKChoisi: lauréat.coefficientKChoisi,
    prixRéférence: lauréat.prixReference,
    emailContact: lauréat.emailContact.email,
    actionnariat: lauréat.actionnariat ? mapToPlainObject(lauréat.actionnariat) : undefined,
  };
};

export type GetActionnaireData = ChampObligatoireAvecAction<{
  nom: string;
}>;

export const getActionnaireData = async ({
  identifiantProjet,
  rôle,
  nécessiteInstruction,
}: Props & {
  nécessiteInstruction: boolean;
}): Promise<GetActionnaireData> => {
  const projection = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const value = { nom: projection.actionnaire };

  if (projection.dateDemandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('actionnaire.consulterChangement')
        ? {
            url: Routes.Actionnaire.changement.détails(
              identifiantProjet.formatter(),
              projection.dateDemandeEnCours.formatter(),
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  const { peutModifier, peutFaireUneDemandeDeChangement, peutEnregistrerChangement } =
    await checkAutorisationChangement<'actionnaire'>({
      identifiantProjet,
      rôle,
      nécessiteInstruction,
      domain: 'actionnaire',
    });

  // TODO:
  // règle spécifique à AOS, à rapatrier dans les règles métier présentes dans les AO si besoin
  const estPetitPV = identifiantProjet.appelOffre === 'PPE2 - Petit PV Bâtiment';

  const action = estPetitPV
    ? undefined
    : peutModifier
      ? {
          url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
          label: 'Modifier',
        }
      : peutEnregistrerChangement
        ? {
            url: Routes.Actionnaire.changement.enregistrer(identifiantProjet.formatter()),
            label: 'Faire un changement',
          }
        : peutFaireUneDemandeDeChangement
          ? {
              url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
              label: 'Faire une demande de changement',
            }
          : undefined;

  return {
    value,
    action,
  };
};

// TODO: ajouter note innovation
