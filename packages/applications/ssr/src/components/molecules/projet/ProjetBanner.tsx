import { FC } from 'react';

import { Routes } from '@potentiel-libraries/routes';

import {
  StatutProjetBadge,
  StatutProjetBadgeProps,
} from '@/components/molecules/projet/StatutProjetBadge';
import { displayDate } from '@/utils/displayDate';

export type ProjetBannerProps = {
  statut: StatutProjetBadgeProps['statut'];
  nom: string;
  appelOffre: string;
  période: string;
  famille: string;
  localité: {
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  dateDésignation: string;
  identifiantProjet: string;
};

export const ProjetBanner: FC<ProjetBannerProps> = ({
  identifiantProjet,
  statut,
  nom,
  appelOffre,
  période,
  famille,
  localité,
  dateDésignation,
}) => {
  return (
    <aside className="mb-3">
      <div className="flex justify-start items-center">
        <a
          href={Routes.Projet.details(identifiantProjet)}
          className="text-xl font-bold !text-white mr-2"
        >
          {nom}
        </a>
        <StatutProjetBadge statut={statut} />
      </div>
      <p className="text-sm font-medium p-0 m-0 mt-2">
        {localité.commune}, {localité.département}, {localité.région}
      </p>
      <div>
        désigné le {displayDate(new Date(dateDésignation))} pour la période {appelOffre} {période}
        {famille ? `, famille ${famille}` : ''}
      </div>
    </aside>
  );
};
