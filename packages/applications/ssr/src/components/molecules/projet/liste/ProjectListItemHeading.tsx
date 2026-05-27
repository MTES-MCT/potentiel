import type React from 'react';
import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import { type Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type ProjectListItemHeadingProps = {
  nomProjet: string;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  prefix: string;
  estNotifié?: boolean;
  actionnariat?: Candidature.TypeActionnariat.RawType;
  badgeStatutProjet?: React.ReactNode;
};

export const ProjectListItemHeading: FC<ProjectListItemHeadingProps> = ({
  nomProjet,
  identifiantProjet,
  prefix,
  badgeStatutProjet,
}) => (
  <div className="flex flex-col justify-between gap-2 w-full">
    <div className="leading-5">
      {prefix} <span className="font-bold mr-3">{nomProjet}</span>
    </div>
    <div className="flex gap-2">
      <div className="flex items-center gap-2 italic text-xs" title="Identifiant projet">
        {IdentifiantProjet.bind(identifiantProjet).formatterMétier()}
      </div>
      {badgeStatutProjet && <div className="flex gap-1">{badgeStatutProjet}</div>}
    </div>
  </div>
);
