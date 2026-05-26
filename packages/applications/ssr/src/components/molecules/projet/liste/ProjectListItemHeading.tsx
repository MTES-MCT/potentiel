import type React from 'react';
import type { FC } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type ProjectListItemHeadingProps = {
  nomProjet: string;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  prefix: string;
  estNotifié?: boolean;
  actionnariat?: Candidature.TypeActionnariat.RawType;
  statutProjetBadge?: React.ReactNode;
};

export const ProjectListItemHeading: FC<ProjectListItemHeadingProps> = ({
  nomProjet,
  identifiantProjet,
  prefix,
  statutProjetBadge,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col justify-between gap-2 w-full">
      <div className="leading-5">
        {prefix} <span className="font-bold mr-3">{nomProjet}</span>
      </div>
      <div className="flex items-center gap-2">
        <FormattedIdentifiantProjet identifiantProjet={identifiantProjet} />{' '}
      </div>
    </div>
    <div className="flex gap-1 md:items-center md:flex-row flex-col">
      {statutProjetBadge && <div className="flex gap-1">{statutProjetBadge}</div>}
    </div>
  </div>
);

const FormattedIdentifiantProjet: FC<{
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
}> = ({ identifiantProjet: { appelOffre, période, famille, numéroCRE } }) => (
  <div className="flex italic text-xs items-center" title="Identifiant projet">
    {appelOffre}-P{période}
    {famille ? `-F${famille}` : ''}-{numéroCRE}
  </div>
);
