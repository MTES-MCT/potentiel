import Leaf from '@codegouvfr/react-dsfr/picto/Leaf';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import type React from 'react';
import type { FC } from 'react';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Option } from '@potentiel-libraries/monads';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Icon } from '@/components/atoms/Icon';
import { CopyButton } from '../CopyButton';

export type ProjetBannerProps = {
  href?: string;
  nom: string;
  statutBadge: React.ReactNode;
  localité?: { commune: string; département: string; région: string };
  dateDésignation: Option.Type<Iso8601DateTime>;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export const ProjetBannerTemplate: FC<ProjetBannerProps> = ({
  href,
  statutBadge,
  nom,
  localité,
  dateDésignation,
  identifiantProjet,
}) => {
  return (
    <aside className="flex flex-col justify-between">
      <div className="flex flex-col mb-2">
        <div className="flex justify-start w-fit gap-4 flex-row items-center">
          <div className="flex gap-2 items-center">
            <Leaf fontSize="large" color="blue-ecume" className="bg-theme-white rounded-lg mr-2" />
            <div>
              {href ? (
                <a
                  href={href}
                  className="text-xl/relaxed print:text-3xl font-bold !text-theme-white mr-2"
                >
                  {nom}
                </a>
              ) : (
                <p className="text-xl font-bold !text-theme-white mr-2">{nom}</p>
              )}
            </div>
          </div>
          <div className="hidden md:block">{statutBadge}</div>
        </div>
      </div>
      <div className="flex gap-4 h-6 mb-1 items-center text-sm font-medium print:text-theme-black">
        {Option.isSome(dateDésignation) && (
          <span>
            Notifié le <FormattedDate date={dateDésignation} className="font-bold" />
          </span>
        )}
        <div className="md:hidden">{statutBadge}</div>
      </div>
      {localité && (
        <p className="flex h-6 items-center text-sm font-medium print:text-theme-black">
          {localité.commune}, {localité.département}, {localité.région}
        </p>
      )}
      <div className="flex gap-2 items-center">
        <p className="text-sm font-medium italic print:text-theme-black">
          {identifiantProjet.formatterMétier()}
        </p>
        <Tooltip
          title={
            <div className="flex flex-col">
              <p className="font-medium text-sm">
                Appel d'offres <strong>{identifiantProjet.appelOffre}</strong>
              </p>
              <p className="font-medium text-sm">
                Période <strong>{identifiantProjet.période}</strong>
              </p>
              {identifiantProjet.famille ? (
                <p className="font-medium text-sm">
                  Famille <strong>{identifiantProjet.famille}</strong>
                </p>
              ) : null}
              <p className="font-medium text-sm">
                Projet numéro <strong>{identifiantProjet.numéroCRE}</strong>
              </p>
            </div>
          }
        >
          <Icon id="ri-information-line" size="sm" />
        </Tooltip>
        <CopyButton
          textToCopy={identifiantProjet.formatterMétier()}
          priority="primary"
          noChildren
        />
      </div>
    </aside>
  );
};
