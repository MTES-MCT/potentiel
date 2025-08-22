import Badge from '@codegouvfr/react-dsfr/Badge';
import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { StatutAbandonBadge } from '../../[identifiant]/abandon/(détails)/StatutAbandonBadge';
import { StatutPreuveRecandidatureBadge } from '../../[identifiant]/abandon/transmettre-preuve-recandidature/StatutPreuveRecandidatureBadge';

export type AbandonListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  statut: Lauréat.Abandon.StatutAbandon.RawType;
  recandidature: boolean;
  preuveRecandidatureStatut: Lauréat.Abandon.StatutPreuveRecandidature.RawType;
  misÀJourLe: Iso8601DateTime;
};

export const AbandonListItem: FC<AbandonListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  misÀJourLe,
  recandidature,
  preuveRecandidatureStatut,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Abandon du projet"
        misÀJourLe={misÀJourLe}
      />
    }
    actions={
      <Link
        href={Routes.Abandon.détail(identifiantProjet)}
        aria-label={`voir le détail de l'abandon en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <StatutAbandonBadge statut={statut} small />
    {recandidature && (
      <>
        <Badge noIcon small className="mx-1" severity="info">
          avec recandidature
        </Badge>
        <StatutPreuveRecandidatureBadge small statut={preuveRecandidatureStatut} />
      </>
    )}
  </ListItem>
);
