'use server';

import { FC } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ProjetBannerTemplate } from './ProjetBanner.template';

export type ProjetBannerProps = {
  identifiantProjet: string;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet }) => {
  return withUtilisateur(async ({ role }) => {
    const candidature = await mediator.send<Candidature.ConsulterRésuméCandidatureQuery>({
      type: 'Candidature.Query.ConsulterRésuméCandidature',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    const { nomProjet, statut, localité, notifiéeLe } = candidature;

    return (
      <ProjetBannerTemplate
        badge={<StatutProjetBadge statut={statut.formatter()} />}
        localité={localité}
        dateDésignation={Option.match(notifiéeLe)
          .some((date) => date.formatter())
          .none()}
        href={role.estÉgaleÀ(Role.grd) ? undefined : Routes.Projet.details(identifiantProjet)}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
};
