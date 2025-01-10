'use server';

import { FC } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { Abandon } from '@potentiel-domain/laureat';
import { Recours } from '@potentiel-domain/elimine';

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

    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    const { nomProjet, localité, notifiéeLe } = candidature;

    const statut = getStatutProjet(candidature, abandon, recours);

    return (
      <ProjetBannerTemplate
        badge={<StatutProjetBadge statut={statut} />}
        localité={localité}
        dateDésignation={Option.match(notifiéeLe)
          .some((date) => date.formatter())
          .none()}
        /***
         * @todo changer le check du rôle quand la page projet sera matérialisée dans le SSR (utiliser role.aLaPermissionDe)
         */
        href={role.estÉgaleÀ(Role.grd) ? undefined : Routes.Projet.details(identifiantProjet)}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nom={nomProjet}
      />
    );
  });
};

const getStatutProjet = (
  candidature: Candidature.ConsulterRésuméCandidatureReadModel,
  abandon: Option.Type<Abandon.ConsulterAbandonReadModel>,
  recours: Option.Type<Recours.ConsulterRecoursReadModel>,
): StatutProjet.RawType => {
  if (Option.isSome(abandon) && abandon.statut.estAccordé()) {
    return 'abandonné';
  }

  if (Option.isSome(recours) && recours.statut.estAccordé()) {
    return 'classé';
  }

  return candidature.statut.formatter();
};
