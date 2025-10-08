import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

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
    misÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Abandon du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Abandon.détail(identifiantProjet),
        }}
        aria-label={`voir le détail de l'abandon pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <StatutDemandeBadge statut={statut} small />
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
