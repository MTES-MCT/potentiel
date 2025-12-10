import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

import { ChampAvecAction } from '../../../_helpers/types';
import { checkAutorisationChangement } from '../../../_helpers/checkAutorisationChangement';
import { getLauréatInfos } from '../../../_helpers/getLauréat';

export type GetProducteurForProjectPage = ChampAvecAction<{
  producteur: string;
}>;

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getProducteur = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetProducteurForProjectPage | undefined> => {
  const projection = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
    type: 'Lauréat.Producteur.Query.ConsulterProducteur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isSome(projection)) {
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
  }

  return undefined;
};

export type GetReprésentantLégalForProjectPage = ChampAvecAction<{
  nom: string;
}>;

export const getReprésentantLégal = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetReprésentantLégalForProjectPage | undefined> => {
  const représentantLégal =
    await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

  if (Option.isSome(représentantLégal)) {
    const demandeEnCours =
      await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>(
        {
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        },
      );

    const value = { nom: représentantLégal.nomReprésentantLégal };

    if (Option.isSome(demandeEnCours)) {
      return {
        value,
        action: rôle.aLaPermission('représentantLégal.consulterChangement')
          ? {
              url: Routes.ReprésentantLégal.changement.détails(
                identifiantProjet.formatter(),
                demandeEnCours.demandéLe.formatter(),
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
      value: { nom: représentantLégal.nomReprésentantLégal },
      action,
    };
  }

  return undefined;
};

export type GetPuissanceForProjectPage = ChampAvecAction<{
  puissance: number;
  puissanceDeSite?: number;
}>;

export const getPuissance = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetPuissanceForProjectPage | undefined> => {
  const puissanceProjection = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isSome(puissanceProjection)) {
    const { puissance, dateDemandeEnCours, puissanceDeSite } = puissanceProjection;
    const value = {
      puissance,
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
  }

  return undefined;
};

export type GetCandidatureForProjectPage = {
  prix: number;
  nomCandidat: string;
  emailContact: string;
  typeActionnariat?: PlainType<Candidature.TypeActionnariat.ValueType>;
};

export const getCandidatureData = async ({
  identifiantProjet,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
}): Promise<GetCandidatureForProjectPage> => {
  const projection = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  return {
    prix: projection.dépôt.prixReference,
    nomCandidat: projection.dépôt.nomCandidat,
    emailContact: projection.dépôt.emailContact.email,
    typeActionnariat: mapToPlainObject(projection.dépôt.actionnariat),
  };
};

export type GetLauréatDataForProjectPage = {
  siteDeProduction: ChampAvecAction<PlainType<Candidature.Localité.ValueType>>;
  coefficientKChoisi?: boolean;
};

export const getLauréatData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetLauréatDataForProjectPage> => {
  const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });

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
  };
};
