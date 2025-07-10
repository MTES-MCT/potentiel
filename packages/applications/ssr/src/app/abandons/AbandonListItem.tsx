import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutAbandonBadge } from '../../components/pages/abandon/StatutAbandonBadge';
import { StatutPreuveRecandidatureBadge } from '../../components/pages/abandon/détails/PreuveRecandidatureStatutBadge';

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
