import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutMainlevéeBadge } from '@/app/laureats/[identifiant]/garanties-financieres/mainlevee/StatutMainlevéeBadge';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { getMotifMainlevéeLabel } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/getMotifMainlevéeLabel';

export type ListItemDemandeMainlevéeProps = {
  demandéLe: Iso8601DateTime;
  identifiantProjet: string;
  statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
  nomProjet: string;
};

export const ListItemDemandeMainlevée: FC<ListItemDemandeMainlevéeProps> = ({
  demandéLe,
  identifiantProjet,
  misÀJourLe,
  motif,
  nomProjet,
  statut,
}) => (
  <ListItem
    miseÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Mainlevée du projet"
        nomProjet={nomProjet}
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.GarantiesFinancières.demandeMainlevée.détails(identifiantProjet),
          'aria-label': `voir le détail de la mainlevée des garanties financières du projet ${nomProjet}`,
        }}
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
      <li>
        <span>
          Motif : <span className="font-semibold capitalize">{getMotifMainlevéeLabel(motif)}</span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande : <FormattedDate className="font-semibold" date={demandéLe} />
        </span>
      </li>
    </ul>
    <StatutMainlevéeBadge statut={statut} />
  </ListItem>
);
