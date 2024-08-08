'use server';

import { FC } from 'react';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { ConsulterProjetQuery } from '@potentiel-domain/candidature';
import { Option } from '@potentiel-libraries/monads';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
export type ProjetBannerProps = {
  identifiantProjet: string;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet }) => {
  const candidature = await mediator.send<ConsulterProjetQuery>({
    type: 'Candidature.Query.ConsulterProjet',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    return notFound();
  }

  const { nom, statut, localité, dateDésignation, appelOffre, famille, période } = candidature;

  return (
    <aside className="mb-3">
      <div className="flex justify-start items-center">
        <a
          href={Routes.Projet.details(identifiantProjet)}
          className="text-xl font-bold !text-theme-white mr-2"
        >
          {nom}
        </a>
        <StatutProjetBadge statut={statut} />
      </div>
      <p className="text-sm font-medium p-0 m-0 mt-2">
        {localité.commune}, {localité.département}, {localité.région}
      </p>
      <div>
        désigné le <FormattedDate date={dateDésignation} /> pour la période {appelOffre} {période}
        {famille ? `, famille ${famille}` : ''}
      </div>
    </aside>
  );
};
