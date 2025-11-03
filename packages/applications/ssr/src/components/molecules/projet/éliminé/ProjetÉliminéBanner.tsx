'use server';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getÉliminé } from '@/app/_helpers/getÉliminé';

import { ProjetBannerTemplate } from '../ProjetBanner.template';

import { StatutÉliminéBadge } from './StatutÉliminéBadge';

export type ProjetÉliminéBannerProps = {
  identifiantProjet: string;
  noLink?: true;
};

export const ProjetÉliminéBanner: FC<ProjetÉliminéBannerProps> = async ({
  identifiantProjet,
  noLink,
}) =>
  withUtilisateur(async ({ rôle }) => {
    const projet = await getÉliminé(identifiantProjet);

    const { nomProjet, localité, notifiéLe } = projet;

    return (
      <ProjetBannerTemplate
        badge={<StatutÉliminéBadge />}
        localité={localité}
        dateDésignation={Option.match(notifiéLe)
          .some((date) => date.formatter())
          .none()}
        /***
         * @todo changer le check du rôle quand la page projet sera matérialisée dans le SSR (utiliser rôle.aLaPermissionDe)
         */
        href={noLink || rôle.estGrd() ? undefined : Routes.Projet.details(identifiantProjet)}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
