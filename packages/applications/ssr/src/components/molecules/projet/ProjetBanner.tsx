'use server';

import { FC } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';

import { ProjetBannerTemplate } from './ProjetBanner.template';

export type ProjetBannerProps = {
  identifiantProjet: string;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet }) => {
  const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
    type: 'Candidature.Query.ConsulterProjet',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(projet)) {
    return notFound();
  }

  const { nom, statut, localité, dateDésignation } = projet;

  return (
    <ProjetBannerTemplate
      badge={<StatutProjetBadge statut={statut} />}
      localité={localité}
      dateDésignation={dateDésignation}
      href={Routes.Projet.details(identifiantProjet)}
      identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
      nom={nom}
    />
  );
};
