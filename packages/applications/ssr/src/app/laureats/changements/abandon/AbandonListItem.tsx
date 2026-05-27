import Badge from '@codegouvfr/react-dsfr/Badge';
import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { ListItem } from '@/components/molecules/ListItem';
import { PPABadge } from '@/components/molecules/projet/lauréat/PPABadge';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import { StatutPreuveRecandidatureBadge } from '../../[identifiant]/abandon/transmettre-preuve-recandidature/StatutPreuveRecandidatureBadge';

export type AbandonListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  statut: Lauréat.Abandon.StatutAbandon.RawType;
  recandidature: boolean;
  preuveRecandidatureStatut: Lauréat.Abandon.StatutPreuveRecandidature.RawType;
  dateDemande: string;
  miseÀJourLe: Iso8601DateTime;
  estPartiEnPPA?: boolean;
};

export const AbandonListItem: FC<AbandonListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  miseÀJourLe,
  recandidature,
  preuveRecandidatureStatut,
  dateDemande,
  estPartiEnPPA,
}) => (
  <ListItem
    miseÀJourLe={miseÀJourLe}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Abandon du projet"
        badgeStatutProjet={estPartiEnPPA && <PPABadge />}
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Abandon.détail(identifiantProjet, dateDemande),
        }}
        aria-label={`voir le détail de l'abandon pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <div className="flex gap-1">
      <StatutDemandeBadge statut={statut} small />
      {recandidature && (
        <>
          <Badge noIcon small severity="info">
            avec recandidature
          </Badge>
          <StatutPreuveRecandidatureBadge small statut={preuveRecandidatureStatut} />
        </>
      )}
    </div>
  </ListItem>
);
