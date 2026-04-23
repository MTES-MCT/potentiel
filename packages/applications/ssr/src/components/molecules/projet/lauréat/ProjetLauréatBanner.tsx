import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { ProjetBannerTemplate } from '../ProjetBanner.template';

import { StatutLauréatBadge } from './StatutLauréatBadge';
import { PPABadge } from './PPABadge';

export type ProjetLauréatBannerProps = {
  identifiantProjet: string;
  noLink?: true;
  projet: PlainType<Lauréat.ConsulterLauréatReadModel>;
};

export const ProjetLauréatBanner: FC<ProjetLauréatBannerProps> = ({
  identifiantProjet,
  noLink,
  projet,
}) =>
  withUtilisateur(async ({ rôle }) => {
    const { nomProjet, localité, notifiéLe, statut, PPA } = projet;

    return (
      <ProjetBannerTemplate
        statutBadge={<StatutLauréatBadge statut={statut.statut} />}
        PPABadge={PPA ? <PPABadge /> : undefined}
        localité={localité}
        dateDésignation={Option.match(notifiéLe)
          .some((date) => date.date)
          .none()}
        /***
         * @todo changer le check du rôle quand la page projet sera matérialisée dans le SSR (utiliser rôle.aLaPermissionDe)
         */
        href={
          noLink || rôle.estGrd()
            ? undefined
            : Routes.Lauréat.détails.tableauDeBord(identifiantProjet)
        }
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
        utilisateurPeutCopier={rôle.estDGEC() || rôle.estDreal()}
      />
    );
  });
