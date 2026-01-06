'use server';

import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers/getLauréat';

import { ProjetBannerTemplate } from '../ProjetBanner.template';

import { StatutLauréatBadge } from './StatutLauréatBadge';

export type ProjetLauréatBannerProps = {
  identifiantProjet: string;
  noLink?: true;
};

export const ProjetLauréatBanner: FC<ProjetLauréatBannerProps> = async ({
  identifiantProjet,
  noLink,
}) =>
  withUtilisateur(async ({ rôle }) => {
    const projet = await getLauréatInfos(
      IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    );

    const { nomProjet, localité, notifiéLe, statut } = projet;

    return (
      <ProjetBannerTemplate
        badge={<StatutLauréatBadge statut={statut.statut} />}
        localité={localité}
        dateDésignation={Option.match(notifiéLe)
          .some((date) => date.formatter())
          .none()}
        /***
         * @todo changer le check du rôle quand la page projet sera matérialisée dans le SSR (utiliser rôle.aLaPermissionDe)
         */
        href={noLink || rôle.estGrd() ? undefined : Routes.Lauréat.détails.tableauDeBord(identifiantProjet)}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
