import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type ListItemDépôtGarantiesFinancièresProps = {
  identifiantProjet: string;
  nomProjet: string;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  misÀJourLe: Iso8601DateTime;
};

export const ListItemDépôtGarantiesFinancières: FC<ListItemDépôtGarantiesFinancièresProps> = ({
  identifiantProjet,
  nomProjet,
  misÀJourLe,
  type,
  dateÉchéance,
}) => (
  <ListItem
    misÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nomProjet={nomProjet}
        prefix="Garanties financières du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
          'aria-label': `voir le détail du dépôt de garanties financières pour le projet ${nomProjet}`,
          prefetch: false,
        }}
      >
        Consulter
      </Button>
    }
  >
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
  </ListItem>
);
