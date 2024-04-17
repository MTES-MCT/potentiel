import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormattedForPageDate } from '@/utils/displayDate';

import { StatutAbandonBadge } from '../StatutAbandonBadge';
import { StatutPreuveRecandidatureBadge } from '../détails/PreuveRecandidatureStatutBadge';

export type AbandonListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  statut: Abandon.StatutAbandon.RawType;
  recandidature: boolean;
  preuveRecandidatureStatut: Abandon.StatutPreuveRecandidature.RawType;
  misÀJourLe: FormattedForPageDate;
};

export const AbandonListItem: FC<AbandonListItemProps> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  statut,
  misÀJourLe,
  recandidature,
  preuveRecandidatureStatut,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Abandon du projet <span className="font-bold">{nomProjet}</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
          <div>
            Appel d'offres : {appelOffre}
            <span className="hidden md:inline-block mr-2">,</span>
          </div>
          <div>Période : {période}</div>
          {famille && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Famille : {famille}
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-3">
          <StatutAbandonBadge statut={statut} small />
          {recandidature && (
            <>
              <Badge noIcon small severity="info">
                avec recandidature
              </Badge>
              <StatutPreuveRecandidatureBadge small statut={preuveRecandidatureStatut} />
            </>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">Dernière mise à jour le {misÀJourLe}</p>
      <a
        href={Routes.Abandon.détail(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail de l'abandon en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </a>
    </div>
  </>
);
