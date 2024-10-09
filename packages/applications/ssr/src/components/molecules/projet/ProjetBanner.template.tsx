'use server';

import React, { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ProjetBannerProps = {
  href?: string;
  nom: string;
  badge: React.ReactNode;
  localité?: { commune: string; département: string; région: string };
  dateDésignation?: Iso8601DateTime;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const ProjetBannerTemplate: FC<ProjetBannerProps> = ({
  href,
  badge,
  nom,
  localité,
  dateDésignation,
  identifiantProjet,
}) => {
  return (
    <aside className="mb-3">
      <div className="flex justify-start items-center">
        {href ? (
          <a href={href} className="text-xl font-bold !text-theme-white mr-2">
            {nom}
          </a>
        ) : (
          <span className="text-xl font-bold !text-theme-white mr-2">{nom}</span>
        )}
        {badge}
      </div>
      {localité && (
        <p className="text-sm font-medium p-0 m-0 mt-2">
          {localité.commune}, {localité.département}, {localité.région}
        </p>
      )}
      {dateDésignation && (
        <div>
          désigné le <FormattedDate date={dateDésignation} /> pour la période{' '}
          {identifiantProjet.appelOffre} {identifiantProjet.période}
          {identifiantProjet.famille ? `, famille ${identifiantProjet.famille}` : ''}
        </div>
      )}
    </aside>
  );
};
