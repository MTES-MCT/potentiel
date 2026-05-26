import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { ProjetBannerTemplate } from '../ProjetBanner.template';
import { PPABadge } from './PPABadge';
import { StatutLauréatBadge } from './StatutLauréatBadge';

export type ProjetLauréatBannerProps = {
  identifiantProjet: string;
  noLink?: true;
  projet: PlainType<Lauréat.ConsulterLauréatReadModel>;
};

export const ProjetLauréatBanner: FC<ProjetLauréatBannerProps> = ({
  identifiantProjet,
  noLink,
  projet: { nomProjet, localité, notifiéLe, statut, estPartiEnPPA },
}) =>
  withUtilisateur(async ({ rôle }) => (
    <ProjetBannerTemplate
      statutBadge={
        <div className="flex gap-2">
          <StatutLauréatBadge statut={statut.statut} />
          {estPartiEnPPA && <PPABadge />}
        </div>
      }
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
    />
  ));
