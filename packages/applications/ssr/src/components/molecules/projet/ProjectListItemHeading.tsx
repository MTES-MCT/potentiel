import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { PlainType } from '@potentiel-domain/core';

import { FormattedDate } from '../../atoms/FormattedDate';

import { StatutProjetBadge } from './StatutProjetBadge';

export type ProjectListItemHeadingProps = {
  nomProjet: string;
  statut?: PlainType<StatutProjet.ValueType>;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  prefix: string;
  misÀJourLe?: Iso8601DateTime;
};

export const ProjectListItemHeading = ({
  nomProjet,
  identifiantProjet,
  prefix,
  misÀJourLe,
  statut,
}: ProjectListItemHeadingProps) => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;
  const fields = [
    {
      title: "Appel d'offres",
      value: appelOffre,
    },
    {
      title: 'Période',
      value: période,
    },
    {
      title: 'Famille',
      value: famille,
    },
    {
      title: 'Numéro CRE',
      value: numéroCRE,
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-2 mt-3 w-full">
        <h2 className="leading-4">
          {prefix} <span className="font-bold mr-3">{nomProjet}</span>
        </h2>
        {misÀJourLe ? (
          <p className="italic text-xs">
            Dernière mise à jour le <FormattedDate date={misÀJourLe} />
          </p>
        ) : null}
      </div>

      <div className="flex flex-col md:flex-row gap-1 md:items-center">
        {statut && <StatutProjetBadge statut={statut.statut} />}

        <div className="flex flex-row gap-2 md:gap-0 italic text-xs">
          {fields.map(({ title, value }, index) =>
            value ? (
              <div key={title} title={title}>
                {index > 0 ? <span className="hidden md:inline-block mx-1"> - </span> : null}
                {value}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};
