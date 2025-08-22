'use server';

import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getProjet } from '@/app/_helpers';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ProjetBannerTemplate } from './ProjetBanner.template';

export type ProjetBannerProps = {
  identifiantProjet: string;
  noLink?: true;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet, noLink }) =>
  withUtilisateur(async ({ role }) => {
    const projet = await getProjet(identifiantProjet);

    if (!projet) {
      return notFound();
    }

    const { nomProjet, localité, notifiéLe, statut } = projet;

    return (
      <ProjetBannerTemplate
        badge={<StatutProjetBadge statut={statut.statut} />}
        localité={localité}
        dateDésignation={Option.match(notifiéLe)
          .some((date) => date.formatter())
          .none()}
        /***
         * @todo changer le check du rôle quand la page projet sera matérialisée dans le SSR (utiliser role.aLaPermissionDe)
         */
        href={
          noLink || role.estÉgaleÀ(Role.grd) ? undefined : Routes.Projet.details(identifiantProjet)
        }
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
