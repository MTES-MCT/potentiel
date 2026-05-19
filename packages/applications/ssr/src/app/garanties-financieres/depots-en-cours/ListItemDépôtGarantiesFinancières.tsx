import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';

export type ListItemDépôtGarantiesFinancièresProps = {
  identifiantProjet: string;
  nomProjet: string;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  misÀJourLe: Iso8601DateTime;
  estPartiEnPPA?: true;
};

export const ListItemDépôtGarantiesFinancières: FC<ListItemDépôtGarantiesFinancièresProps> = ({
  identifiantProjet,
  nomProjet,
  misÀJourLe,
  type,
  dateÉchéance,
  estPartiEnPPA,
}) => (
  <ListItem
    miseÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nomProjet={nomProjet}
        prefix="Garanties financières du projet"
        estPartiEnPPA={estPartiEnPPA}
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.GarantiesFinancières.dépôt.détails(identifiantProjet),
          'aria-label': `voir le détail du dépôt de garanties financières pour le projet ${nomProjet}`,
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
