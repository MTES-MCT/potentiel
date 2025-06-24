import React, { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

import { CopyButton } from '../CopyButton';

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
}) => (
  <aside className="mb-3">
    <div className="md:flex items-start justify-between">
      <div>
        <div className="flex justify-start w-fit gap-4 flex-col md:flex-row md:gap-0 md:items-center">
          <div className="flex print:hidden">
            {href ? (
              <a href={href} className="text-xl font-bold !text-theme-white mr-2">
                {nom}
              </a>
            ) : (
              <p className="text-xl font-bold !text-theme-white mr-2">{nom}</p>
            )}
            {process.env.APPLICATION_STAGE !== 'production' && (
              <CopyButton
                className="mx-2"
                textToCopy={identifiantProjet.formatter()}
                priority="primary"
                noChildren
              />
            )}
          </div>
          <p className="hidden print:block text-xl font-bold text-theme-black">{nom}</p>
          {badge}
        </div>
        {localité && (
          <p className="text-sm font-medium p-0 m-0 mt-2 print:text-theme-black">
            {localité.commune}, {localité.département}, {localité.région}
          </p>
        )}
        <p className="text-sm font-medium p-0 m-0 mt-2 print:text-theme-black">
          {Option.isSome(dateDésignation) && (
            <>
              Notifié le <FormattedDate date={dateDésignation} className="font-bold" /> pour{' '}
            </>
          )}
          Appel d'offres {identifiantProjet.appelOffre}, période {identifiantProjet.période}
          {identifiantProjet.famille ? `, famille ${identifiantProjet.famille}` : ''}
        </p>
      </div>
    </div>
  </aside>
);
