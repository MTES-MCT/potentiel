import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { getMotifMainlevéeLabel } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/getMotifMainlevéeLabel';
import { StatutMainlevéeBadge } from '@/app/laureats/[identifiant]/garanties-financieres/mainlevee/StatutMainlevéeBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';

export type ListItemDemandeMainlevéeProps = {
  demandéLe: Iso8601DateTime;
  identifiantProjet: string;
  statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.RawType;
  nomProjet: string;
  estPartiEnPPA?: true;
};

export const ListItemDemandeMainlevée: FC<ListItemDemandeMainlevéeProps> = ({
  demandéLe,
  identifiantProjet,
  misÀJourLe,
  motif,
  nomProjet,
  statut,
  estPartiEnPPA,
}) => (
  <ListItem
    miseÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Mainlevée du projet"
        nomProjet={nomProjet}
        estPartiEnPPA={estPartiEnPPA}
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
