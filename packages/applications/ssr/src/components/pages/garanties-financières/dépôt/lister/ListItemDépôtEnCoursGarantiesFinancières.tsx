import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ProjectListItemHeading } from '@/components/molecules/ProjectListItemHeading';

export type ListItemDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
  nomProjet: string;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  misÀJourLe: Iso8601DateTime;
};

export const ListItemDépôtEnCoursGarantiesFinancières: FC<
  ListItemDépôtEnCoursGarantiesFinancièresProps
> = ({ identifiantProjet, nomProjet, misÀJourLe, type, dateÉchéance }) => (
  <div className="w-full">
    <ProjectListItemHeading
      identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
      nomProjet={nomProjet}
      prefix="Garanties financières du projet"
      misÀJourLe={misÀJourLe}
    />
    <ul className="mt-3 text-sm">
      <li>
        {type ? (
          <span>
            Type : <span className="font-semibold">{type}</span>
          </span>
        ) : (
          'Type de garanties financières à compléter'
        )}
      </li>
      {dateÉchéance && (
        <li>
          Date d'échéance : <FormattedDate className="font-semibold" date={dateÉchéance} />
        </li>
      )}
    </ul>

    <a
      href={Routes.GarantiesFinancières.détail(identifiantProjet)}
      className="self-end mt-2"
      aria-label={`voir le détail des garanties financières à traiter pour le projet ${nomProjet}`}
    >
      voir le détail
    </a>
  </div>
);
