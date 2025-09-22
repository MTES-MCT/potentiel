import { FC } from 'react';
import Link from 'next/link';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutMainlevéeBadge } from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/StatutMainlevéeBadge';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { convertMotifMainlevéeForView } from '@/app/laureats/[identifiant]/garanties-financieres/(mainlevée)/_helpers';

export type ListItemDemandeMainlevéeProps = {
  demandéLe: Iso8601DateTime;
  identifiantProjet: string;
  statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
  misÀJourLe: Iso8601DateTime;
  motif: string;
  nomProjet: string;
  peutInstruireMainlevée: boolean;
};

export const ListItemDemandeMainlevée: FC<ListItemDemandeMainlevéeProps> = ({
  demandéLe,
  identifiantProjet,
  misÀJourLe,
  motif,
  nomProjet,
  statut,
  peutInstruireMainlevée,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Mainlevée du projet"
        nomProjet={nomProjet}
        misÀJourLe={misÀJourLe}
      />
    }
    actions={
      <Link href={Routes.GarantiesFinancières.détail(identifiantProjet)} aria-label={`voir`}>
        {peutInstruireMainlevée ? 'Instruire' : 'Voir'}
      </Link>
    }
  >
    <StatutMainlevéeBadge statut={statut} />
    <ul className="mt-3 text-sm">
      <li>
        <span>
          Motif :{' '}
          <span className="font-semibold capitalize">{convertMotifMainlevéeForView(motif)}</span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande : <FormattedDate className="font-semibold" date={demandéLe} />
        </span>
      </li>
    </ul>
  </ListItem>
);
