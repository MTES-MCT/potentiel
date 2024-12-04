'use server';

import React, { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Option } from '@potentiel-libraries/monads';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ProjetBannerProps = {
  href?: string;
  nom: string;
  badge: React.ReactNode;
  localité?: { commune: string; département: string; région: string };
  dateDésignation: Option.Type<Iso8601DateTime>;
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
      <p className="text-sm font-medium p-0 m-0 mt-2">
        {Option.isSome(dateDésignation) && (
          <span>
            Désigné le <FormattedDate date={dateDésignation} /> pour{' '}
          </span>
        )}
        Appel d'offres {identifiantProjet.appelOffre}, période {identifiantProjet.période}
        {identifiantProjet.famille ? `, famille ${identifiantProjet.famille}` : ''}
      </p>
    </aside>
  );
};
