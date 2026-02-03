import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { PlainType } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { ProjetBannerTemplate } from '../ProjetBanner.template';

import { StatutÉliminéBadge } from './StatutÉliminéBadge';

export type ProjetÉliminéBannerProps = {
  identifiantProjet: string;
  noLink?: true;
  projet: PlainType<Éliminé.ConsulterÉliminéReadModel>;
};

export const ProjetÉliminéBanner: FC<ProjetÉliminéBannerProps> = ({
  identifiantProjet,
  noLink,
  projet,
}) =>
  withUtilisateur(async ({ rôle }) => {
    const { nomProjet, localité, notifiéLe } = projet;

    return (
      <ProjetBannerTemplate
        badge={<StatutÉliminéBadge />}
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
            : Routes.Éliminé.détails.tableauDeBord(identifiantProjet)
        }
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
