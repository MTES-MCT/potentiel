import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { PlainType } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';

import { FormattedDate } from '../../atoms/FormattedDate';

import { NotificationBadge } from './NotificationBadge';
import { StatutCandidatureBadge } from './StatutCandidatureBadge';

export type CandidatureListItemHeadingProps = {
  nomProjet: string;
  statut: Candidature.StatutCandidature.RawType;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  prefix: string;
  misÀJourLe?: Iso8601DateTime;
  estNotifié?: boolean;
  actionnariat?: Candidature.TypeActionnariat.RawType;
};

export const CandidatureListItemHeading: FC<CandidatureListItemHeadingProps> = ({
  nomProjet,
  identifiantProjet,
  prefix,
  misÀJourLe,
  statut,
  estNotifié,
  actionnariat,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-row justify-between gap-2 w-full">
      <h2 className="leading-5">
        {prefix} <span className="font-bold mr-3">{nomProjet}</span>
      </h2>
      {misÀJourLe ? (
        <p className="italic text-xs">
          Dernière mise à jour le <FormattedDate date={misÀJourLe} />
        </p>
      ) : null}
    </div>

    <div className="flex gap-1 md:items-center md:flex-row flex-col">
      <div className="flex gap-1">
        <StatutCandidatureBadge statut={statut} actionnariat={actionnariat} />
        {estNotifié !== undefined && <NotificationBadge estNotifié={estNotifié} />}
      </div>

      <FormattedIdentifiantProjet identifiantProjet={identifiantProjet} />
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
