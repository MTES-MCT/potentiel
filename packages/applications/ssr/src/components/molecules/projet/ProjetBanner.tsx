'use server';
import { FC } from 'react';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ProjetBannerProps = {
  identifiantProjet: string;
};

export const ProjetBanner: FC<ProjetBannerProps> = async ({ identifiantProjet }) => {
  const { nom, statut, localité, dateDésignation, appelOffre, famille, période } =
    await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

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
