import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjectListItemHeading } from '@/components/molecules/ProjectListItemHeading';

import { StatutAbandonBadge } from '../StatutAbandonBadge';
import { StatutPreuveRecandidatureBadge } from '../détails/PreuveRecandidatureStatutBadge';

export type AbandonListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  statut: Abandon.StatutAbandon.RawType;
  recandidature: boolean;
  preuveRecandidatureStatut: Abandon.StatutPreuveRecandidature.RawType;
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
  <div className="w-full">
    <ProjectListItemHeading
      nomProjet={nomProjet}
      identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
      prefix="Abandon du projet"
      misÀJourLe={misÀJourLe}
    />
    <div className="flex flex-row justify-between gap-2 mt-3 w-full">
      <StatutAbandonBadge statut={statut} small />
      {recandidature && (
        <>
          <Badge noIcon small severity="info">
            avec recandidature
          </Badge>
          <StatutPreuveRecandidatureBadge small statut={preuveRecandidatureStatut} />
        </>
      )}

      <a
        href={Routes.Abandon.détail(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail de l'abandon en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </a>
    </div>
  </div>
);
