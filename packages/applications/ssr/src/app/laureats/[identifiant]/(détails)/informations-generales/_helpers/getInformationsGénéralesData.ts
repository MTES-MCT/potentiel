import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject, PlainType } from '@potentiel-domain/core';

import { ChampObligatoireAvecAction } from '../../../_helpers/types';
import { getLauréatInfos } from '../../../_helpers/getLauréat';

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
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

  // const { peutModifier, peutFaireUneDemandeDeChangement } = await checkAutorisationChangement({
  //   identifiantProjet,
  //   rôle,
  //   domain: 'puissance',
  //   policyMap: {
  //     modifier: 'puissance.modifier',
  //     demanderChangement: 'puissance.demanderChangement',
  //     enregistrerChangement: 'puissance.enregistrerChangement',
  //   },
  // });

  // const action = peutModifier
  //   ? {
  //       url: Routes.Puissance.modifier(identifiantProjet.formatter()),
  //       label: 'Modifier',
  //     }
  //   : peutFaireUneDemandeDeChangement
  //     ? {
  //         url: Routes.Puissance.changement.demander(identifiantProjet.formatter()),
  //         label: 'Changer de puissance',
  //       }
  //     : undefined;

  // TODO
  const action = undefined;
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

// Ajouter Note Innovation
