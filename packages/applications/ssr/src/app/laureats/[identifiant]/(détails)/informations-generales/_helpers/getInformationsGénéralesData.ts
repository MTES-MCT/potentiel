import { Candidature } from '@potentiel-domain/projet';
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

export type GetLauréatData = {
  siteDeProduction: ChampObligatoireAvecAction<PlainType<Candidature.Localité.ValueType>>;
  emailContact: string;
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
    emailContact: lauréat.emailContact.email,
  };
};

// Ajouter Note Innovation
