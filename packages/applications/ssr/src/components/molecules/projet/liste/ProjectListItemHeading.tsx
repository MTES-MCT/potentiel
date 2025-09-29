import React, { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { PlainType } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type ProjectListItemHeadingProps = {
  nomProjet: string;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  prefix: string;
  misÀJourLe?: Iso8601DateTime;
  estNotifié?: boolean;
  actionnariat?: Candidature.TypeActionnariat.RawType;
  statutBadge?: React.ReactNode;
};

export const ProjectListItemHeading: FC<ProjectListItemHeadingProps> = ({
  nomProjet,
  identifiantProjet,
  prefix,
  misÀJourLe,
  statutBadge,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col justify-between gap-2 w-full">
      <h2 className="leading-5">
        {prefix} <span className="font-bold mr-3">{nomProjet}</span>
      </h2>
      <div className="flex items-center gap-2">
        <FormattedIdentifiantProjet identifiantProjet={identifiantProjet} />{' '}
        {misÀJourLe && (
          <p className="italic text-xs">
            - Dernière mise à jour le <FormattedDate date={misÀJourLe} />
          </p>
        )}
      </div>
    </div>
    <div className="flex gap-1 md:items-center md:flex-row flex-col">
      {statutBadge && <div className="flex gap-1">{statutBadge}</div>}
    </div>
  </div>
);

const FormattedIdentifiantProjet: FC<{
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
}> = ({ identifiantProjet: { appelOffre, période, famille, numéroCRE } }) => (
  <div
    className="flex italic text-xs items-center"
    aria-label="Identifiant projet"
    title="Identifiant projet"
  >
    {appelOffre}-P{période}
    {famille ? `-F${famille}` : ''}-{numéroCRE}
  </div>
);
