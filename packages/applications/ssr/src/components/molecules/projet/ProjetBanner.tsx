'use server';

import { FC } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ProjetBannerTemplate } from './ProjetBanner.template';

export type ProjetBannerProps = {
  identifiantProjet: string;
  noLink?: true;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet, noLink }) => {
  return withUtilisateur(async ({ role }) => {
    const projet = await getProjet(identifiantProjet);
    if (!projet) {
      return notFound();
    }
    const { nomProjet, localité, notifiéLe, statut } = projet;

    return (
      <ProjetBannerTemplate
        badge={<StatutProjetBadge statut={statut} />}
        localité={localité}
        dateDésignation={notifiéLe}
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
};

const getProjet = async (
  identifiantProjet: string,
): Promise<
  | {
      nomProjet: string;
      localité: Candidature.ConsulterCandidatureReadModel['localité'];
      notifiéLe: Option.Type<DateTime.RawType>;
      statut: StatutProjet.RawType;
    }
  | undefined
> => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(lauréat)) {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const statut = Option.isSome(abandon) && abandon.statut.estAccordé() ? 'abandonné' : 'classé';

    return {
      nomProjet: lauréat.nomProjet,
      localité: lauréat.localité,
      notifiéLe: lauréat.notifiéLe.formatter(),
      statut,
    };
  }

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(candidature)) {
    return {
      nomProjet: candidature.nomProjet,
      localité: candidature.localité,
      notifiéLe: candidature.notification?.notifiéeLe.formatter() ?? Option.none,
      statut: candidature.statut.formatter(),
    };
  }
  return;
};
