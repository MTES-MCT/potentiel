import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  StatutProjetBadge,
  StatutProjetBadgeProps,
} from '@/components/molecules/projet/StatutProjetBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';

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
  dateDésignation: Iso8601DateTime;
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
